import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import { BuyOrderCreated } from "../generated/schema"
import { BuyOrderCreated as BuyOrderCreatedEvent } from "../generated/Orderbook/Orderbook"
import { handleBuyOrderCreated } from "../src/orderbook"
import { createBuyOrderCreatedEvent } from "./orderbook-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = Bytes.fromI32(1234567890)
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let amount = BigInt.fromI32(234)
    let pricePerOne = BigInt.fromI32(234)
    let newBuyOrderCreatedEvent = createBuyOrderCreatedEvent(
      id,
      creator,
      tokenAddress,
      tokenId,
      amount,
      pricePerOne
    )
    handleBuyOrderCreated(newBuyOrderCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BuyOrderCreated created and stored", () => {
    assert.entityCount("BuyOrderCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BuyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BuyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BuyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "BuyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "BuyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pricePerOne",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
