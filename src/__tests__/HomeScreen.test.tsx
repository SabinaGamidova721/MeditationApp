import { render } from "@testing-library/react-native";
import HomeScreen from "../screens/HomeScreen";

describe("HomeScreen", () => {
  it("renders meditation list", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("Calm (10 min)")).toBeTruthy();
    expect(getByText("Focus (15 min)")).toBeTruthy();
  });
});
