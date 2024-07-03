import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessKeyPartnerGuard extends AuthGuard("access-key-partner") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
