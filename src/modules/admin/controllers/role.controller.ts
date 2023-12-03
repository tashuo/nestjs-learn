import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/common/base/controller.base";
import { AuthUser } from "src/common/decorators/authUser.decorator";
import { IAuthUser } from "src/interfaces/auth";
import { AdminService } from "../admin.service";
import { CreateMenuDto, MenuDto, UpdateMenuDto } from "../dto/menu.dto";
import { AdminMenuEntity, AdminRoleEntity, AdminRoleMenusEntity, AdminRoleUsersEntity } from "../entities";
import { isNil } from 'lodash';
import { RoleService } from "../services";
import { AntdProPaginateDto } from "src/common/base/paginate.dto";
import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";

@ApiBearerAuth()
@ApiTags('管理后台')
@Controller('admin/role')
export class RoleController extends BaseController {
    constructor(private readonly service: RoleService) {
        super();
    }

    @Get('/')
    async getRoles(@Query() query: AntdProPaginateDto) {
        return this.service.getRoles(query);
    }

    @Post('/')
    async createRole(@Body() createDto: CreateRoleDto) {
        return this.successResponse(await this.service.createRole(createDto));
    }

    @Patch(':id')
    async updateRole(@Param('id') id: number, @Body() updateDto: UpdateRoleDto) {
        const role = await AdminRoleEntity.findOneBy({ id });
        if (isNil(role)) {
            return {
                error: 'role not exists',
            };
        }

        return this.successResponse(await this.service.updateRole(role, updateDto));
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: number) {
        await AdminRoleMenusEntity.createQueryBuilder('role_menu')
            .leftJoinAndSelect('role_menu.role', 'role')
            .where('role.id = :id', { id })
            .delete()
            .execute();

        await AdminRoleUsersEntity.createQueryBuilder('role_user')
            .leftJoinAndSelect('role_user.role', 'role')
            .where('role.id = :id', { id })
            .delete()
            .execute();
        
        AdminRoleEntity.delete(id);
    }
}