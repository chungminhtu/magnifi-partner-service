import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoggerService } from "../common/logger.service";
import { GenerateDto } from "./dto/generate.dto";
import { FastifyReply } from "fastify";
import { ApiKeyMagnifiGuard } from "./guards/api-key-magnifi.guard";
import { RequestId } from "../common/decorators/request-id.decorator";
import { RemoveDto } from "./dto/remove.dto";

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  @Post("generate")
  @UseGuards(ApiKeyMagnifiGuard)
  async generate(
    @RequestId() requestId: string,
    @Body() generateDto: GenerateDto,
    @Res() res: FastifyReply,
  ): Promise<Record<string, any>> {
    const { entityId, userId, organizationMemberId } = generateDto;
    const partnerDetails = { entityId, userId, organizationMemberId };
    const _log_ctx = { entityId, requestId };

    try {
      this.logger.log("Partner requested generation of access key", { ..._log_ctx });

      const response = await this.authService.generate(partnerDetails, _log_ctx);

      this.logger.log("Partner access key generated successfully", {
        ..._log_ctx,
        partner_access_key: response.partnerAccessKey,
      });

      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message:
          "Partner Access key generated successfully. Please note the partner Access key down. It will not be shown again.",
        data: response,
      });
    } catch (error) {
      this.logger.error("failed to generate Partner access key", { error, ..._log_ctx });

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "failed to generate Partner access key. Please contact support with your entityId or requestId.",
        data: null,
      });
    }
  }

  @Get(":entityId/list")
  @UseGuards(ApiKeyMagnifiGuard)
  async list(
    @RequestId() requestId: string,
    @Param("entityId") entityId: string,
    @Query("showAll") showAll: string,
    @Res() res: FastifyReply,
  ): Promise<Record<string, any>> {
    const _log_ctx = { entityId, requestId, showAll };
    try {
      this.logger.log("Partner requested list of access keys", { ..._log_ctx });

      const partnerAccessKeys = await this.authService.list(entityId, showAll === "true");

      this.logger.log("Partner access keys listed successfully", { ..._log_ctx });

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "Partner access keys listed successfully",
        data: partnerAccessKeys,
      });
    } catch (error) {
      this.logger.error("failed to list access keys", { error, ..._log_ctx });

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to list access keys. Please contact support with your entityId or requestId.",
        data: null,
      });
    }
  }

  @Delete("remove")
  @UseGuards(ApiKeyMagnifiGuard)
  async remove(
    @RequestId() requestId: string,
    @Body() removeDto: RemoveDto,
    @Res() res: FastifyReply,
  ): Promise<Record<string, any>> {
    const { partnerAccessKeyId, entityId } = removeDto;
    const _log_ctx = { partnerAccessKeyId, entityId, requestId };

    try {
      this.logger.log("Partner requested removal of access key", { ..._log_ctx });

      await this.authService.remove(removeDto, _log_ctx);

      this.logger.log("Partner access key removed successfully", { ..._log_ctx });

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      this.logger.error("failed to remove access key", { error, ..._log_ctx });
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to remove access key. Please contact support with your entityId or requestId.",
        data: null,
      });
    }
  }
}
