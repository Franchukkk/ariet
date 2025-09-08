import { Card } from "./Card";

const DATA = [
  {
    title: "Автономная работа до 30 минут =",
    subtitle: "безопасность и стабильность рабочих процессов. ",
  },
  {
    title: "Надёжные АКБ =",
    subtitle: "меньше технических рисков и расходов на замену.",
  },
  {
    title: "Серия HR =",
    subtitle: "лучший инструмент для интенсивной эксплуатации.",
  },
];

export const List = () => (
  <div className="flex flex-col gap-[7px]">
    {DATA.map(({ title, subtitle }, i) => (
      <Card key={i} title={title} subtitle={subtitle} />
    ))}
  </div>
);
