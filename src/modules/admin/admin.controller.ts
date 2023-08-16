import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BaseController } from 'src/common/base/controller.base';
import { AdminService } from './admin.service';
import { AuthUser } from 'src/common/decorators/authUser.decorator';
import { IAuthUser } from 'src/interfaces/auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMenuDto, SetMenusDto, UpdateMenuDto } from './dto/menu.dto';
import { AdminMenuEntity } from './entities';
import { isNil } from 'lodash';

@ApiBearerAuth()
@ApiTags('管理后台')
@Controller('admin')
export class AdminController extends BaseController {
    constructor(private readonly service: AdminService) {
        super();
    }

    @Get('menu')
    async getMenus(@AuthUser() user: IAuthUser) {
        return this.service.getMenus(user.userId);
    }

    @Post('menu')
    async createMenu(@Body() createDto: CreateMenuDto) {
        return this.service.createMenu(createDto);
    }

    @Post('menu/order')
    async setMenu(@Body() menuDto: SetMenusDto) {
        return this.service.setMenu(menuDto.menus);
    }

    @Patch('menu/:id')
    async updateMenu(@Param('id') id: number, @Body() updateDto: UpdateMenuDto) {
        const menu = await AdminMenuEntity.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (isNil(menu)) {
            return {
                error: 'menu not exists',
            };
        }

        return this.service.updateMenu(menu, updateDto);
    }

    @Delete('menu/:id')
    async deleteMenu(@Param('id') id: number) {
        AdminMenuEntity.delete(id);
    }
}
