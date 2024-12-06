import { Timeline } from "./Timeline";

test("Выводит объект при вводе правильных данных", () => {
  const input = {value: "12.12, 32.32"};
  const timeline = new Timeline();
  const obj = timeline.customCoordsInput(input);

  expect(obj.latitude).toEqual("12.12");
})


