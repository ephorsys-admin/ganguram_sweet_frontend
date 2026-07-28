import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ForgotEmailStep from "./ForgotEmailStep";
import ForgotResetStep from "./ForgotResetStep";
import ForgotSuccessStep from "./ForgotSuccessStep";

const ForgotPasswordForm = ({ onLoginClick, onResetSuccessComplete }) => {
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "reset" | "success"
  const [forgotEmail, setForgotEmail] = useState("");

  const handleEmailSubmitted = (email) => {
    setForgotEmail(email);
    setForgotStep("reset");
  };

  const handleResetComplete = () => {
    setForgotStep("success");
  };

  const handleSuccessTimeout = () => {
    onResetSuccessComplete();
    // Reset internal state after flip transition completes
    setTimeout(() => {
      setForgotEmail("");
      setForgotStep("email");
    }, 800);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <AnimatePresence mode="wait">
        
        {forgotStep === "email" && (
          <ForgotEmailStep
            onBackClick={onLoginClick}
            onEmailSubmitted={handleEmailSubmitted}
          />
        )}

        {forgotStep === "reset" && (
          <ForgotResetStep
            email={forgotEmail}
            onBackClick={() => setForgotStep("email")}
            onResetComplete={handleResetComplete}
          />
        )}

        {forgotStep === "success" && (
          <ForgotSuccessStep
            onTimeout={handleSuccessTimeout}
          />
        )}

      </AnimatePresence>
    </div>
  );
};

export default ForgotPasswordForm;
