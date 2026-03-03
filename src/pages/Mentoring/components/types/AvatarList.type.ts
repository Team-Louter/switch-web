type PersonType = "single" | "batch";

interface BaseItem {
  id: number;
  roomId: number;
  type: PersonType;
  name: string;
}

interface SingleItem extends BaseItem {
  type: "single";
  userImg: string;
}

interface BatchItem extends BaseItem {
  type: "batch";
  users: { id: number; img: string }[];
}

export type AvatarItem = SingleItem | BatchItem;
