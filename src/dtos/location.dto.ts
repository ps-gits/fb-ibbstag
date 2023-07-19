import { IsString } from 'class-validator';

export class SetLocationDto {
  @IsString()
  public Label: string;

  @IsString()
  public Code: string;
}
 