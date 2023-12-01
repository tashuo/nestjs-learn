import { Injectable } from "@nestjs/common";
import { AdminMenuEntity, AdminRoleEntity, AdminRoleMenusEntity } from "../entities";
import { flatToTree, treeToFlat } from "src/utils/helper";
import { CreateMenuDto, MenuDto, UpdateMenuDto } from "../dto/menu.dto";
import { keyBy } from 'lodash';
import { In } from "typeorm";

@Injectable()
export class MenuService {
    async getMenus(adminUserId: number) {
        const menus = await AdminMenuEntity.find({
            relations: ['parent'],
            order: { weight: 'DESC' },
            select: ['id', 'path'], // path用于匹配路由，name和icon用以菜单展示可以使用默认值
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

    async getAllMenus() {
        const menus = await AdminMenuEntity.find({
            relations: ['parent'],
            order: { weight: 'DESC' },
        });
        return flatToTree<AdminMenuEntity>(menus);
    }

    async setMenu(orderMenus: MenuDto[]) {
        console.log(orderMenus);
        const menus: MenuDto[] = treeToFlat(orderMenus);
        console.log(menus);
        const originMenus = await AdminMenuEntity.find({ relations: ['parent'] });
        console.log(menus.length, originMenus.length);
        if (menus.length !== originMenus.length) {
            throw new Error('invalid menus');
        }
        const indexedOriginMenus = keyBy(originMenus, 'id');
        console.log(indexedOriginMenus);
        const menuLen = menus.length;
        originMenus.forEach((v: AdminMenuEntity) => {
            let index = -1;
            menus.forEach((mV, mK) => {
                if (mV.id === v.id) {
                    index = mK;
                    return;
                }
            });
            if (index === -1) {
                throw new Error(`menu(${v.id}) missed`);
            }
            console.log(v.id, index, menus[index]);
            v.weight = menuLen - index;
            v.parent = menus[index]?.parent ? indexedOriginMenus[menus[index].parent.id] : null;
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
}