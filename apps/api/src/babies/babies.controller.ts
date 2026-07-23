import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard, type AuthRequest } from "../auth/jwt.guard";
import { BabiesService } from "./babies.service";
import { CreateBabyDto, CreateEventDto } from "./babies.dto";

@Controller("babies")
@UseGuards(JwtGuard)
export class BabiesController {
  constructor(private readonly babies: BabiesService) {}

  @Get()
  list(@Req() req: AuthRequest) {
    return this.babies.list(req.userId);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateBabyDto) {
    return this.babies.create(req.userId, dto);
  }

  @Get(":id/events")
  listEvents(
    @Req() req: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
    @Query("de") de?: string,
    @Query("ate") ate?: string,
  ) {
    return this.babies.listEvents(req.userId, id, de, ate);
  }

  @Post(":id/events")
  createEvent(
    @Req() req: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CreateEventDto,
    @Headers("idempotency-key") idempotencyKey?: string,
  ) {
    return this.babies.createEvent(req.userId, id, dto, idempotencyKey);
  }

  @Delete(":id/events/:eventId")
  deleteEvent(
    @Req() req: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
    @Param("eventId", ParseUUIDPipe) eventId: string,
  ) {
    return this.babies.deleteEvent(req.userId, id, eventId);
  }
}
