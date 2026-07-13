# Auto DM Initial Plan

## Purpose

Auto DM is a mobile-first companion for a physical, dice-based dungeon adventure. It helps a table create heroes, plan a dungeon, generate fair monster encounters, and share the current state of play. Players draw the dungeon, roll real dice, and tell the story together.

This plan intentionally starts with a small, playable foundation. The goal is a fun, understandable tabletop experience for a seven-year-old and adults, not a full Dungeons & Dragons rules engine.

## Working Agreement

- Keep this document current as decisions are made. Mark completed work with `[x]` and add a short outcome note below the milestone.
- Make at least one focused commit for every completed milestone.
- Treat each numbered milestone as a commit and testing checkpoint, not an automatic pause. Complete the agreed workstream autonomously and keep one draft PR to `main` updated for the user to review and merge.
- The user reviews and merges PRs. Do not merge or deploy without explicit instruction.
- Build and test the actual tabletop flow with short play sessions before expanding the rules.

## Product Principles

- Mobile first, iPad comfortable, desktop supported without becoming the primary design target.
- The app explains what to do at the table; it should not require RPG experience or a rulebook.
- Keep math small and visible. Prefer simple card instructions over modifiers and exceptions.
- Let users choose only dice they want to use. Generated content must never require an unselected die.
- Make encounters challenging, varied, and fair for the heroes that were actually created.
- Keep complexity in Auto DM's generation and balancing, not in player-facing rules.

## Decisions Made

- Deployment adapter: Nitro (agnostic), for Vercel deployment.
- Frontend environment variable: `VITE_CONVEX_URL` contains the Convex Cloud deployment URL.
- Auto DM is a tabletop companion, not a video game.
- A combat round is the player-facing name for the repeated combat sequence.
- A turn uses neutral names: `actor` takes an action against one or more `targets`.
- Dice Kit is a configurable preference. A `d20` is required for the first ruleset; other dice are optional.
- Initial difficulty choices are Easy, Medium, and Hard.
- Mobs are optional and must be enabled by a setting before encounters can include multiple copies of one monster.

## Milestones

### 1. Lock the tabletop rules

- [ ] Define the exact combat round: choose action, choose reaction when applicable, roll, resolve, continue.
- [ ] Define the first success rule using a `d20`, including what counts as a success.
- [ ] Define health, damage, healing, defeat, and victory using small, child-friendly numbers.
- [ ] Decide whether reactions are limited per round, per combat, or by an item/resource.
- [ ] Specify how multi-target and area-of-effect actions resolve.
- [ ] Write a one-page play guide and validate it in a short real-table playtest.

**Stopping point:** The rules can be explained and played without the app by a child and an adult.

### 2. Define heroes and hero creation

- [ ] Choose initial classes: Paladin, Cleric, Wizard, Rogue, Ranger, and Fighter.
- [ ] Give every class a balance role, health range, default action, and one signature move.
- [ ] Decide how heritage is represented as optional story flavor: Elf, Human, Dwarf, and similar choices.
- [ ] Define the minimum hero fields needed for balancing and card display.
- [ ] Specify multi-hero party creation and editing.

**Stopping point:** A group can create a balanced party of one or more heroes with no RPG knowledge.

### 3. Define dungeon setup and difficulty

- [ ] Specify dungeon inputs: theme, number of rooms, party, final boss, difficulty, and Dice Kit.
- [ ] Define Easy, Medium, and Hard in terms players can understand and in terms the balancing system can use.
- [ ] Define the Dice Kit presets: Simple (`d6` + `d20`), Your Set, and Full Set.
- [ ] Add the optional Mobs setting. When off, every encounter contains one monster; when on, it may contain groups such as three goblins.
- [ ] Define the encounter progression from opening room through final boss.

**Stopping point:** The app has a complete, understandable adventure-setup specification.

### 4. Design encounter balancing and generation

- [ ] Create a party-strength model based on the selected heroes and their available actions.
- [ ] Reserve a challenge budget for the final boss and distribute the rest across rooms.
- [ ] Define how difficulty changes monster health, damage, count, and special abilities.
- [ ] Define variety rules to prevent repetitive encounters.
- [ ] Generate encounters that only use enabled Dice Kit dice.
- [ ] Create test scenarios for solo heroes, mixed parties, every difficulty, and mobs on/off.

**Stopping point:** Given the same setup, Auto DM can generate a complete dungeon with a defensible difficulty curve.

### 5. Design the card system and tabletop flow

- [ ] Define hero card content: health, actions, signature move, and required dice.
- [ ] Define monster card content: health, turn instruction, damage die, reaction, and special ability.
- [ ] Define item cards for healing, protection, and a small number of dramatic effects.
- [ ] Define the combat screen language for actor, targets, action, reaction, roll, and outcome.
- [ ] Prototype a complete room-to-combat-to-next-room flow before visual polish.

**Stopping point:** Cards and the combat view tell the table exactly what to do without outside instructions.

### 6. Build the local, single-device experience

- [ ] Set up the app shell, routes, and mobile-first visual foundation.
- [ ] Build hero creation and party management.
- [ ] Build dungeon setup, Dice Kit selection, difficulty, and Mobs settings.
- [ ] Build encounter generation, hero cards, monster cards, and the combat-round view.
- [ ] Add responsive layouts for phones, iPad, and constrained desktop use.
- [ ] Add automated tests for core generation and combat state transitions.

**Stopping point:** One device can run a complete generated dungeon at a physical table.

### 7. Add shared sessions with Convex

- [ ] Design the session data model: adventure, party, dungeon, encounter, combat state, and participant presence.
- [ ] Create a session with a short, human-enterable join code.
- [ ] Let participants join and see shared state in real time.
- [ ] Define permissions for the session host and participants.
- [ ] Handle reconnecting, invalid codes, and safe session cleanup.
- [ ] Test two phones and an iPad in the same session.

**Stopping point:** A host and participants can reliably follow the same game state from separate devices.

### 8. Playtest, simplify, and release the first version

- [ ] Run short playtests with children and adults.
- [ ] Record confusion points, pacing problems, and balance problems.
- [ ] Simplify rules and interface before adding new systems.
- [ ] Verify accessibility, tap targets, mobile layout, and iPad layout.
- [ ] Verify production configuration only after the reviewed code is merged to `main`.
- [ ] Deploy from merged `main` using the agreed release process.

**Stopping point:** Auto DM supports a complete, enjoyable tabletop adventure with a shared session option.

## Initial Monster Roster

These are content candidates, not final rules. Each will later receive a simple card, balance values, supported dice, and at most one memorable ability in the first version.

| Monster | Theme or role | Mob candidate |
| --- | --- | --- |
| Goblin | Sneaky basic enemy | Yes |
| Skeleton | Simple undead guard | Yes |
| Giant Rat | Fast beginner creature | Yes |
| Bat Swarm | Flying nuisance | Yes |
| Slime | Slow creature that splits or sticks | Yes |
| Kobold | Trap-loving tunnel dweller | Yes |
| Spider | Web and ambush creature | Yes |
| Zombie | Slow, tough undead | Yes |
| Bandit | Clever human-sized foe | Yes |
| Orc | Strong frontline attacker | Yes |
| Wolf | Fast pack hunter | Yes |
| Cultist | Dark-magic follower | Yes |
| Mimic | Treasure chest surprise | No |
| Ghost | Spooky enemy that ignores some defenses | No |
| Gargoyle | Stone guardian | No |
| Dark Elf Scout | Fast magical scout | Yes |
| Bugbear | Heavy ambusher | No |
| Minotaur | Charging maze guardian | No |
| Troll | Tough creature that recovers health | No |
| Owlbear | Wild, dramatic bruiser | No |
| Wraith | Advanced undead threat | No |
| Basilisk | Petrifying stare boss-style creature | No |
| Medusa | Dangerous magical foe | No |
| Gelatinous Cube | Dungeon-corridor hazard creature | No |
| Fire Elemental | Fire-themed magical threat | No |
| Ice Elemental | Cold-themed magical threat | No |
| Stone Golem | Very tough guardian | No |
| Young Dragon | Major final boss | No |
| Necromancer | Summons undead and serves as a boss | No |
| Lich King | Late-game magical final boss | No |

## Open Questions

- What exact `d20` result succeeds against a standard target, and when does that number change?
- Should Block, Dodge, and Item be reactions available to every hero, or should classes change that list?
- Does a hero have a limited resource such as stamina, magic, or item uses? If so, how simple can it be?
- How does the table track a defeated monster or hero: health only, a knocked-out state, or both?
- Should the app suggest a physical dungeon map layout, or only generate what belongs in the rooms?
- Are there adventure themes beyond a standard dungeon in the first version, such as forest, castle, or cave?
