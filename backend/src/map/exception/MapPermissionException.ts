import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class MapPermissionException extends BaseException {
  constructor(id: number) {
    super({
      code: 306,
      message: `[${id}] 지도에 대한 권한이 없습니다.`,
      status: HttpStatus.FORBIDDEN,
    });
  }
}
