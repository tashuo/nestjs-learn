import { Injectable } from "@nestjs/common";
import { AdminMenuEntity, AdminRoleEntity, AdminRoleMenusEntity } from "../entities";
import { convertToAntdProPaginationResponse, flatToTree, treeToFlat } from "src/utils/helper";
import { CreateMenuDto, MenuDto, UpdateMenuDto } from "../dto/menu.dto";
import { keyBy } from 'lodash';
import { In } from "typeorm";
import { AntdProPaginateDto } from "src/common/base/paginate.dto";
import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";

@Injectable()
export class RoleService {
    async getRoles(queryDto: AntdProPaginateDto) {
        const current = queryDto.current;
        const pageSize = queryDto.pageSize;
        const roles = await AdminRoleEntity.find({relations: ['menus.menu']});
        return convertToAntdProPaginationResponse(
            { current, pageSize },
            roles,
            roles.length,
        );
    }

    async createRole(dto: CreateRoleDto) {
        const role = new AdminRoleEntity;
        role.slug = dto.slug;
        role.name = dto.name;
        await role.save();
        if (dto.menus?.length > 0) {
            AdminRoleMenusEntity.createQueryBuilder()
                .insert()
                .values((await AdminMenuEntity.findBy({id: In(dto.menus)})).map((menu) => ({
                    menu,
                    role,
                    created_at: new Date(),
                }))).execute();
        }
    }

    async updateRole(role: AdminRoleEntity, {menus, ...data}: UpdateRoleDto) {
        await AdminRoleMenusEntity.createQueryBuilder('role_menu')
            .leftJoinAndSelect('role_menu.role', 'role')
            .where('role.id = :id', { id: role.id })
            .delete()
            .execute();
        
        if (menus?.length > 0) {
            AdminRoleMenusEntity.createQueryBuilder()
                .insert()
                .updateEntity(false)
                .values(
                    (await AdminMenuEntity.findBy({ id: In(menus) })).map((menu: AdminMenuEntity) => ({
                        menu,
                        role,
                    })),
                )
                .execute();
        }
    
        AdminRoleEntity.update(
            role.id,
            Object.assign(data),
        );
    }
}