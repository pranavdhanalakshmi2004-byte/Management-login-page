import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "./assets/plogo.jpg";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: isSignup
      ? Yup.string().required("Name is required")
      : Yup.string(),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),

    confirmPassword: isSignup
      ? Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm your password")
      : Yup.string(),

    role: isSignup
      ? Yup.string().required("Role is required")
      : Yup.string(),
  });

  const handleSubmit = (values, { resetForm }) => {
    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
      // Check if email already exists
      const emailExists = existingUsers.find(
        (user) => user.email === values.email
      );

      if (emailExists) {
        alert("Email already registered");
        return;
      }

      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      alert("Signup Successful! Please Login.");
      setIsSignup(false);
      resetForm();
      return;
    }

    // LOGIN LOGIC
    const foundUser = existingUsers.find(
      (user) =>
        user.email === values.email &&
        user.password === values.password
    );

    if (foundUser) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(foundUser)
      );

      navigate("/dashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <img src={logo} alt="logo" className="img" />

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>

            {isSignup && (
              <>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  className="input"
                />
                <ErrorMessage name="name" component="div" className="error" />

            
                <Field as="select" name="role" className="input">
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </Field>
                <ErrorMessage name="role" component="div" className="error" />
              </>
            )}

            <Field
              type="email"
              name="email"
              placeholder="Enter Email"
              className="input"
            />
            <ErrorMessage name="email" component="div" className="error" />

            <Field
              type="password"
              name="password"
              placeholder="Enter Password"
              className="input"
            />
            <ErrorMessage name="password" component="div" className="error" />

            {isSignup && (
              <>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter Password"
                  className="input"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error"
                />
              </>
            )}

            <button type="submit" className="btn">
              {isSignup ? "Signup" : "Login"}
            </button>

          </Form>
        </Formik>

        <p style={{ marginTop: "15px", cursor: "pointer" }}>
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            onClick={() => setIsSignup(!isSignup)}
            style={{ color: "#667eea", marginLeft: "5px" }}
          >
            {isSignup ? "Login" : "Signup"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;