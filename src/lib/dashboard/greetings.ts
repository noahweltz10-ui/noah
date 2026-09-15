export function pickGreeting(name: string): string {
  const hour = new Date().getHours();
  const timeOfDay = hour < 5 ? "night owl hours" : hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const lines = [
    `hey ${name} — here's where things stand.`,
    `welcome back, ${name}.`,
    `good ${timeOfDay}, ${name}.`,
    `${name}, everything's up and running.`,
    `hey ${name} — nothing's on fire.`,
    `back again, ${name}? let's see what changed.`,
    `${name}, the shop's all yours.`,
    `hey ${name} — quick look before you go?`,
    `all clear, ${name}.`,
    `${name}, let's check on drop 001.`,
  ];

  return lines[Math.floor(Math.random() * lines.length)];
}
