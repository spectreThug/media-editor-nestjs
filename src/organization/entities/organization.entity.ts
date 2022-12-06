import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  DefaultPositions,
  IntegrationService,
} from 'src/constants/enums.constants';
import {
  IsObject,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Expose } from 'class-transformer';

export type OrganizationDocument = Organization & Document;
@Schema({ _id: false })
// class Text {
//   @Expose()
//   @IsString()
//   @Prop({
//     type: String,
//   })
//   content: string;
//   @Expose()
//   @IsString()
//   @Prop({
//     type: String,
//   })
//   color: string;
//   @Expose()
//   @IsString()
//   @Prop({
//     type: String,
//     enum: DefaultPositions,
//   })
//   position: string;
// }

@Schema({ _id: false })
class Logo {
  @Expose()
  @IsString()
  @Prop({
    type: String,
  })
  url: string;

  @Expose()
  @IsString()
  @Prop({
    type: String,
    enum: DefaultPositions,
  })
  position: string;

  @Expose()
  @IsNumber()
  @Prop({
    type: Number,
  })
  scale: number;

  @Expose()
  @IsBoolean()
  @Prop({
    type: Boolean,
  })
  applyOnAll: boolean;
}

@Schema({ _id: false })
export class Watermark {
  @Expose()
  @IsObject()
  @Prop({
    type: Logo,
  })
  logo: Logo;

  // @Expose()
  // @IsObject()
  // @IsOptional()
  // @Prop({
  //   type: Text,
  // })
  // text?: Text;
}

@Schema({ _id: false })
class DefaultSettings {
  @Prop({
    type: Watermark,
  })
  watermark: Watermark;
}

@Schema({ timestamps: true, autoIndex: true })
export class Organization {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: [String],
    enum: IntegrationService,
    required: true,
  })
  integrationService: IntegrationService[];

  @Prop({
    type: String,
    required: true,
  })
  identifier: string;

  @Prop({
    type: String,
    required: true,
  })
  secret: string;

  @Prop({
    type: DefaultSettings,
  })
  defaults: DefaultSettings;
  @Prop({ type: Boolean, default: false })
  removed: boolean;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
