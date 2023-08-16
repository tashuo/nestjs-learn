import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
    AdminMenuEntity,
    AdminPermissionEntity,
    AdminRoleEntity,
    AdminRoleMenusEntity,
    AdminUserEntity,
} from './entities';
import { isNil, keyBy } from 'lodash';
import { flatToTree, treeToFlat } from 'src/utils/helper';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { In } from 'typeorm';

interface OrderMenu {
    id: number;
    depth: number;
    parent: OrderMenu | null;
}

@Injectable()
export class AdminService {
    async getMenus(adminUserId: number) {
        const menus = await AdminMenuEntity.find({
            relations: ['parent'],
            order: { weight: 'DESC' },
            select: ['id', 'name', 'uri', 'icon'],
            where: {
                roles: {
                    role: {
                        users: {
                            user: {
                                id: adminUserId,
                            },
                        },
                    },
                },
            },
        });
        return flatToTree<AdminMenuEntity>(menus);
    }

    async setMenu(menu: string) {
        const menusTree = JSON.parse(menu);
        if (isNil(menusTree) || menusTree.length === 0) {
            throw new Error('empty menus');
        }
        const menus: OrderMenu[] = treeToFlat(menusTree);
        const indexedMenus: { [key: string]: OrderMenu } = keyBy(menus, 'id');
        console.log(indexedMenus);
        const originMenus = await AdminMenuEntity.find({ relations: ['parent'] });
        if (menus.length !== (await originMenus).length) {
            throw new Error('invalid menus');
        }
        const indexedOriginMenus = keyBy(originMenus, 'id');
        const menuLen = menus.length;
        originMenus.forEach((v: AdminMenuEntity, index: number) => {
            const item = indexedMenus[v.id.toString()];
            if (isNil(item)) {
                throw new Error(`menu(${v.id}) missed`);
            }
            v.weight = menuLen - index;
            v.parent = item.parent ? indexedOriginMenus[item.parent.id] : null;
            v.save();
        });
    }

    async createMenu({ parent, roles, ...data }: CreateMenuDto) {
        const menu = await AdminMenuEntity.save<AdminMenuEntity>({
            ...data,
            parent: parent ? await AdminMenuEntity.findOneBy({ id: parent }) : null,
        });
        if (roles.length !== 0) {
            const roleEntities = await AdminRoleEntity.findBy({ id: In(roles) });
            AdminRoleMenusEntity.createQueryBuilder()
                .insert()
                .updateEntity(false)
                .values(
                    roleEntities.map((role: AdminRoleEntity) => ({
                        menu,
                        role,
                    })),
                )
                .execute();
        }
    }

    async updateMenu(menu: AdminMenuEntity, { parent, roles, ...data }: UpdateMenuDto) {
        await AdminRoleMenusEntity.createQueryBuilder('role_menu')
            .leftJoinAndSelect('role_menu.menu', 'menu')
            .where('menu.id = :id', { id: menu.id })
            .delete()
            .execute();
        if (roles.length !== 0) {
            const roleEntities = await AdminRoleEntity.findBy({ id: In(roles) });
            AdminRoleMenusEntity.createQueryBuilder()
                .insert()
                .updateEntity(false)
                .values(
                    roleEntities.map((role: AdminRoleEntity) => ({
                        menu,
                        role,
                    })),
                )
                .execute();
        }

        AdminMenuEntity.update(
            menu.id,
            Object.assign(data, {
                parent: parent ? await AdminMenuEntity.findOneBy({ id: parent }) : null,
            }),
        );
    }

    /**
     * rbac权限校验
     * @param adminUserId
     * @param request
     */
    async canUserActivate(adminUserId: number, request: Request): Promise<boolean> {
        const http_method = request.method;
        const http_path = request.path;
        const permissions = await AdminUserEntity.createQueryBuilder('admin')
            .innerJoinAndSelect('admin.roles', 'roles')
            .innerJoinAndSelect('roles.role', 'role')
            .innerJoinAndSelect('role.permissions', 'permissions')
            .innerJoinAndSelect('permissions.permission', 'permission')
            .where('admin.id = :adminUserId', { adminUserId })
            .select('permission.*')
            .distinct()
            .getRawMany();
        if (isNil(permissions)) {
            return false;
        }
        let activate = false;
        permissions.every((permission: AdminPermissionEntity) => {
            if (
                (permission.http_path === http_path ||
                    (permission.http_path.slice(-1) === '*' &&
                        http_path.startsWith(
                            permission.http_path.substring(0, permission.http_path.length - 1),
                        ))) &&
                (permission.http_method === '' ||
                    permission.http_method.toLowerCase() === http_method.toLowerCase())
            ) {
                activate = true;
                return false;
            }
            return true;
        });

        return activate;
    }
}
