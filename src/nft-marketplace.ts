import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ActiveItem,
  ItemBought,
  ItemCanceled,
  ItemListed,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
  const idFromEventParams = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let itemBought = ItemBought.load(idFromEventParams);
  let activeItem = ActiveItem.load(idFromEventParams);

  if (!itemBought) {
    itemBought = new ItemBought(idFromEventParams);
  }

  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;

  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  const idFromEventParams = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let itemCanceled = ItemCanceled.load(idFromEventParams);
  let activeItem = ActiveItem.load(idFromEventParams);

  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(idFromEventParams);
  }

  itemCanceled.owner = event.params.owner;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );

  itemCanceled.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  const idFromEventParams = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let itemListed = ItemListed.load(idFromEventParams);
  let activeItem = ActiveItem.load(idFromEventParams);

  if (!itemListed) {
    itemListed = new ItemListed(idFromEventParams);
  }
  if (!activeItem) {
    activeItem = new ActiveItem(idFromEventParams);
  }

  itemListed.seller = event.params.seller;
  itemListed.nftAddress = event.params.nftAddress;
  itemListed.tokenId = event.params.tokenId;
  itemListed.price = event.params.price;

  activeItem.seller = event.params.seller;
  activeItem.nftAddress = event.params.nftAddress;
  activeItem.tokenId = event.params.tokenId;
  activeItem.price = event.params.price;
  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItem.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return `${tokenId.toHexString()}${nftAddress.toHexString()}`;
}
