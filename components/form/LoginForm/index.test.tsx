import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { IFormData } from "lib/types";
import LoginForm from ".";

const setup = () => {
  const formData: IFormData = {
    username: "Espinete",
    password: "My-Super-Secret",
  };

  const mockSubmit = jest.fn().mockImplementation((formData) => {
    return {
      username: formData.username,
      password: formData.password,
    };
  });

  const utils = render(
    <LoginForm onSubmit={mockSubmit} submitLabel="submit" />
  );
  const username = utils.getByLabelText("username-input");
  const password = utils.getByLabelText("password-input");
  const button = utils.getByLabelText("submit-button");

  return {
    formData,
    mockSubmit,
    username,
    password,
    button,
    ...utils,
  };
};

describe("Login form", () => {
  test("It should display required error when value is invalid", async () => {
    const { mockSubmit, username, password, button } = setup();

    fireEvent.input(username, { target: { value: "" } });
    fireEvent.input(password, { target: { value: "" } });
    fireEvent.submit(button);

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(mockSubmit).not.toBeCalled();
  });

  test("It should send correct username and password", async () => {
    const { formData, mockSubmit, username, password, button } = setup();

    act(() => {
      fireEvent.input(username, { target: { value: formData.username } });
      fireEvent.input(password, { target: { value: formData.password } });
      fireEvent.submit(button);
    });

    await waitFor(() => {
      expect(screen.queryAllByRole("alert")).toHaveLength(0);
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          username: formData.username,
          password: formData.password,
        },
        expect.objectContaining({ _reactName: "onSubmit" })
      );
    });
  });
});
