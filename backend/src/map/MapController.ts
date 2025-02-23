import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MapService } from '@src/map/MapService';
import { CreateMapRequest } from '@src/map/dto/CreateMapRequest';
import { UpdateMapInfoRequest } from '@src/map/dto/UpdateMapInfoRequest';
import { AddPinToMapRequest } from '@src/map/dto/AddPinToMapRequest';
import { UpdateMapVisibilityRequest } from '@src/map/dto/UpdateMapVisibilityRequest';
import { UpdatePinInfoInMapRequest } from '@src/map/dto/UpdatePinInfoInMapRequest';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
import { MapPermissionGuard } from '@src/map/guards/MapPermissionGuard';
import { EmptyRequestException } from '@src/common/exception/EmptyRequestException';
import { AuthUser } from '@src/auth/decortator/AuthUser';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';

@Controller('/maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async getMaps(
    @Query('query') query?: string,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(15)) limit?: number,
  ) {
    if (query) {
      return await this.mapService.searchMaps(query, page, limit);
    }
    return await this.mapService.getAllMaps(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async getMyMaps(
    @AuthUser() user: AuthUser,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(15)) limit?: number,
  ) {
    return await this.mapService.getMyMaps(user.userId, page, limit);
  }

  @Get('/:id')
  async getMapDetail(@Param('id') id: number) {
    return await this.mapService.getMap(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMap(
    @Body() createMapRequest: CreateMapRequest,
    @AuthUser() user: AuthUser,
  ) {
    return await this.mapService.createMap(user.userId, createMapRequest);
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Post('/:id/places')
  async addPinToMap(
    @Param('id') id: number,
    @Body() addPinToMapRequest: AddPinToMapRequest,
  ) {
    return await this.mapService.addPin(id, addPinToMapRequest);
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Put('/:id/places/:placeId')
  async updatePinInfoInMap(
    @Param('id') id: number,
    @Param('placeId') placeId: number,
    @Body() updatePinInfoInMapRequest: UpdatePinInfoInMapRequest,
  ) {
    if (updatePinInfoInMapRequest.isEmpty()) {
      throw new EmptyRequestException();
    }

    await this.mapService.updatePin(id, placeId, updatePinInfoInMapRequest);
    return { mapId: id, placeId, ...updatePinInfoInMapRequest };
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Delete('/:id/places/:placeId')
  async deletePin(@Param('id') id: number, @Param('placeId') placeId: number) {
    return await this.mapService.deletePin(id, placeId);
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Patch('/:id/info')
  async updateMapInfo(
    @Param('id') id: number,
    @Body() updateMapInfoRequest: UpdateMapInfoRequest,
  ) {
    if (updateMapInfoRequest.isEmpty()) {
      throw new EmptyRequestException();
    }

    await this.mapService.updateInfo(id, updateMapInfoRequest);
    return { id, ...updateMapInfoRequest };
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Patch('/:id/visibility')
  async updateMapVisibility(
    @Param('id') id: number,
    @Body() updateMapVisibilityRequest: UpdateMapVisibilityRequest,
  ) {
    await this.mapService.updateMapVisibility(id, updateMapVisibilityRequest);
    return { id, ...updateMapVisibilityRequest };
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Delete('/:id')
  async deleteMap(@Param('id') id: number) {
    return await this.mapService.deleteMap(id);
  }
}
