import { Document, model, Schema } from "mongoose";

const COLLECTION_NAME = "users";
const COLLECTION_NAME2 = "messages";
const COLLECTION_NAME3 = "kaspi";

export interface IUserInfo extends Document {
  chatId: string;
  store: string;
}

export interface IMessages extends Document {
  chatId: string;
  message: string;
  fromMe: boolean;
}

export interface IKaspi extends Document {
  storeId: string;
  storeName: string;
  storePhone: string;
}

const UserInfoSchema = new Schema<IUserInfo>(
  {
    chatId: {
      type: String,
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

const MessagesSchema = new Schema<IMessages>(
  {
    chatId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    fromMe: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true
  }
);

const KaspiSchema = new Schema<IKaspi>(
  {
    storeId: {
      type: String,
      
    },
    storeName: {
      type: String,
    },
    storePhone: {
      type: String,
    },
  },
  {
    timestamps: true
  }
);

const UserModel = model<IUserInfo>(COLLECTION_NAME, UserInfoSchema);
const MessagesModel = model<IMessages>(COLLECTION_NAME2, MessagesSchema);
const KaspiModel = model<IKaspi>(COLLECTION_NAME3, KaspiSchema);

export { UserModel, MessagesModel, KaspiModel };