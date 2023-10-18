import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/common/base/controller.base';
import { AdminService } from './admin.service';
import { AuthUser } from 'src/common/decorators/authUser.decorator';
import { IAuthUser } from 'src/interfaces/auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMenuDto, SetMenusDto, UpdateMenuDto } from './dto/menu.dto';
import { AdminMenuEntity } from './entities';
import { isNil } from 'lodash';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Guest } from 'src/common/decorators/guest.decorator';

@ApiBearerAuth()
@ApiTags('管理后台')
@Controller('admin')
export class AdminController extends BaseController {
    constructor(private readonly service: AdminService) {
        super();
    }

    @Guest()
    @UseGuards(AdminAuthGuard)
    @Post('login')
    async login(@Req() req: any, @Body() _data: LoginDto) {
        return this.successResponse(await this.service.login(req.user));
    }

    @Get('profile')
    async info(@AuthUser() user: IAuthUser) {
        return this.successResponse(await this.service.getProfile(user.userId));
    }

    @Get('menu')
    async getMenus(@AuthUser() user: IAuthUser) {
        return this.successResponse(await this.service.getMenus(user.userId));
    }

    @Get('allMenus')
    async getAllMenus(@AuthUser() user: IAuthUser) {
        return this.successResponse(await this.service.getAllMenus());
    }

    @Post('menu')
    async createMenu(@Body() createDto: CreateMenuDto) {
        return this.successResponse(await this.service.createMenu(createDto));
    }

    @Post('menu/order')
    async setMenu(@Body() menuDto: SetMenusDto) {
        return this.successResponse(await this.service.setMenu(menuDto.menus));
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

        return this.successResponse(await this.service.updateMenu(menu, updateDto));
    }

    @Delete('menu/:id')
    async deleteMenu(@Param('id') id: number) {
        AdminMenuEntity.delete(id);
    }
}
