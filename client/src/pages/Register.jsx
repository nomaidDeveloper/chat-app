import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo1.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = (data) => {
    const { password, confirmPassword, username, email } = data;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const onSubmit = async (data) => {
    if (handleValidation(data)) {
      try {
        const { email, username, password } = data;
        const response = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        if (response.data.status === false) {
          toast.error(response.data.msg, toastOptions);
        } else if (response.data.status === true) {
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(response.data.user)
          );
          navigate("/");
        }
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>test</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: true, minLength: 3 })}
          />
          {errors.username && (
            <span className="error">Username is required (min. 3 characters).</span>
          )}
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="error">Email is required.</span>
          )}
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password && (
            <span className="error">Password is required (min. 8 characters).</span>
          )}
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", { required: true, minLength: 8 })}
          />
          {errors.confirmPassword && (
            <span className="error">Confirm Password is required (min. 8 characters).</span>
          )}
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  .error {
    color: red; /* Set the error message color to red */
    font-size: 0.8rem;
    margin-top: -1rem; /* Adjust margin to avoid extra space */
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
