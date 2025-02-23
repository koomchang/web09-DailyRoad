import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, ILike, MoreThan } from 'typeorm';
import { Place } from '@src/place/entity/PlaceEntity';
import { SoftDeleteRepository } from '@src/common/SoftDeleteRepository';

@Injectable()
export class PlaceRepository extends SoftDeleteRepository<Place, number> {
  constructor(private readonly datasource: DataSource) {
    super(Place, datasource.createEntityManager());
  }

  async findAll(page: number, pageSize: number) {
    this.validatePageAndPageSize(page, pageSize);

    return this.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findByGooglePlaceId(googlePlaceId: string) {
    return this.findOne({ where: { googlePlaceId } });
  }

  async searchByNameOrAddressQuery(
    query: string,
    page: number,
    pageSize: number,
  ) {
    this.validatePageAndPageSize(page, pageSize);

    return this.find({
      where: [
        { formattedAddress: ILike(`%${query}%`) },
        { name: ILike(`%${query}%`) },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  public async findUpdatedPlacesForTwoHours(): Promise<Place[]> {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    return this.find({
      where: [
        { createdAt: MoreThan(twoHoursAgo) },
        { updatedAt: MoreThan(twoHoursAgo) },
        { deletedAt: MoreThan(twoHoursAgo) },
      ],
    });
  }

  private validatePageAndPageSize(page: number, pageSize: number) {
    if (page <= 0) {
      throw new BadRequestException('페이지는 1 이상이어야 합니다.');
    }

    if (pageSize <= 0) {
      throw new BadRequestException('페이지 크기는 1 이상이어야 합니다.');
    }
  }
}
