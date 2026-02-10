import type { Chip, InputChip } from "../entities/chips";
import type { Entity } from "../entities/entity";
import { EntityUtils } from "../entities/utils";

export enum EntityCapability {
	Draggable,
	SecondaryAction,
	Toggleable,
}

type CapabilityEntityMap = {
	[EntityCapability.SecondaryAction]: Chip;
	[EntityCapability.Draggable]: Chip;
	[EntityCapability.Toggleable]: InputChip;
};

type NarrowingPredicate<
	Allowed extends Entity,
	Narrowed extends Allowed = Allowed,
> = (entity: Entity) => entity is Narrowed;

type CapabilityPolicyMap = {
	[K in EntityCapability]: NarrowingPredicate<CapabilityEntityMap[K]>[];
};

const CAPABILITY_POLICY: CapabilityPolicyMap = {
	[EntityCapability.SecondaryAction]: [
		(e): e is Chip => EntityUtils.isChip(e) && !EntityUtils.isIOChip(e),
	],
	[EntityCapability.Draggable]: [
		(e): e is Chip => EntityUtils.isChip(e) && !EntityUtils.isIOChip(e),
	],
	[EntityCapability.Toggleable]: [
		(e): e is InputChip => EntityUtils.isIOChip(e),
	],
};

export function hasCapability<C extends EntityCapability>(
	entity: Entity,
	capability: C,
): entity is CapabilityEntityMap[C] {
	return CAPABILITY_POLICY[capability].some((predicate) => predicate(entity));
}
