import { ApiProperty } from "@nestjs/swagger";
export class SignUpDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class SignInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}