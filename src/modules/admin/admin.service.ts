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
import { autoFillMissedParents, convertToAntdProPaginationResponse, flatToTree, treeToFlat } from 'src/utils/helper';
import { CreateMenuDto, MenuDto, UpdateMenuDto } from './dto/menu.dto';
import { In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IAuthUser } from 'src/interfaces/auth';
import { JwtService } from '@nestjs/jwt';
import { MenuRepository } from './repositories/menu.repository';
import { UsersDto } from './dto/user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { convertToPaginationResponse } from 'src/utils/helper';
import { PostDto } from './dto/post.dto';
import { PostEntity } from '../post/entities/post.entity';

interface OrderMenu {
    id: number;
    depth: number;
    parent: OrderMenu | null;
}

@Injectable()
export class AdminService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly menuRepostory: MenuRepository,
    ) {}

    async validateUser(username: string, password: string): Promise<AdminUserEntity> {
        const admin = await AdminUserEntity.findOneBy({ username });
        if (!isNil(admin) && (await bcrypt.compare(password, admin.password))) {
            return admin;
        }
    }

    async login(admin: AdminUserEntity) {
        const payload: IAuthUser = { username: admin.username, userId: admin.id };
        console.log(payload);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getProfile(userId: number) {
        const profile = await AdminUserEntity.findOneBy({ id: userId });
        profile.menus = await this.getMenus(profile.id);
        return profile;
    }

    async getUsers(queryDto: UsersDto) {
        const current = queryDto.current;
        const pageSize = queryDto.pageSize;
        const query = UserEntity.createQueryBuilder();
        if (queryDto.id) {
            query.andWhere('id =: id', {id: queryDto.id});
        }
        if (queryDto.username) {
            query.andWhere('username like :username', {username: `%${queryDto.username}%`});
        }
        if (queryDto.orderBy) {
            query.orderBy(queryDto.orderBy, queryDto.orderByAsc ? 'ASC' : 'DESC');
        }
        query.take(pageSize).skip((current - 1) * pageSize);
        const data = await query.getManyAndCount();
        return convertToAntdProPaginationResponse(
            { current, pageSize },
            data[0],
            data[1],
        );
    }

    async getPosts(queryDto: PostDto) {
        console.log(queryDto);
        const current = queryDto.current;
        const pageSize = queryDto.pageSize;
        const query = PostEntity.createQueryBuilder();
        if (queryDto.id) {
            query.andWhere('id =: id', {id: queryDto.id});
        }
        if (queryDto.title) {
            query.andWhere('title like :title', {title: `%${queryDto.title}%`});
        }
        if (queryDto.content) {
            query.andWhere('content like :content', {content: `%${queryDto.content}%`});
        }
        if (queryDto.orderBy) {
            query.orderBy(queryDto.orderBy, queryDto.orderByAsc ? 'ASC' : 'DESC');
        }
        query.take(pageSize).skip((current - 1) * pageSize);
        const data = await query.getManyAndCount();
        return convertToAntdProPaginationResponse(
            { current, pageSize },
            data[0],
            data[1],
        );
    }

    async getMenus(adminUserId: number) {
        const menus = await AdminMenuEntity.find({
            relations: ['parent'],
            order: { weight: 'DESC' },
            select: ['id', 'path', 'weight'], // path用于匹配路由，name和icon用以菜单展示可以使用默认值
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
        const data = flatToTree<AdminMenuEntity>(autoFillMissedParents(menus));
        return data;
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
