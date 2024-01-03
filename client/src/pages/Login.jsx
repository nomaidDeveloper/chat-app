import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import Logo from "../assets/logo1.svg";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;

      // Validate email format using a regular expression
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format", toastOptions);
        return;
      }

      const response = await axios.post(loginRoute, { email, password });

      if (response.data.status === false) {
        toast.error(response.data.msg, toastOptions);
      } else if (response.data.status === true) {
        localStorage.setItem('token',response.data.token)
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(response.data.user)
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Test</h1>
          </div>
          <input
            type="text"
            placeholder="email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format.",
              },
            })}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password should be at least 8 characters.",
              },
              maxLength: {
                value: 50,
                message: "Password should be at most 50 characters.",
              },
            })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
          <button type="submit">Log In</button>
          <span>
            Don't have an account? <Link to="/register">Create One.</Link>
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
  background-color: white;
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
    padding: 5rem;
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
    color: red;
    font-size: 0.8rem;
    margin-top: -1rem;
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
