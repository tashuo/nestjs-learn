import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/common/base/controller.base";
import { CreateMenuDto, MenuDto, UpdateMenuDto } from "../dto/menu.dto";
import { AdminMenuEntity } from "../entities";
import { isNil } from 'lodash';
import { MenuService } from "../services";

@ApiBearerAuth()
@ApiTags('管理后台')
@Controller('admin/menu')
export class MenuController extends BaseController {
    constructor(private readonly service: MenuService) {
        super();
    }

    @Get('/')
    async getMenus() {
        return this.successResponse(await this.service.getAllMenus());
    }

    @Post('/')
    async createMenu(@Body() createDto: CreateMenuDto) {
        return this.successResponse(await this.service.createMenu(createDto));
    }

    @Post('order')
    async setMenu(@Body(new ParseArrayPipe({ items: MenuDto })) menus: MenuDto[]) {
        return this.successResponse(await this.service.setMenu(menus));
    }

    @Patch(':id')
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

    @Delete(':id')
    async deleteMenu(@Param('id') id: number) {
        AdminMenuEntity.delete(id);
    }
}