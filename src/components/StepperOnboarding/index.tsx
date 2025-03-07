"use client";
import { Container, Step, StepLabel, Stepper, Typography } from "@mui/material";
import useResponsive from "@/hooks/useResponsive";
import { usePathname } from "next/navigation";
import { STEPS_ONBOARDING_CONFIG } from "@/consts";
import { StepperProgress, StepperWrap } from "./styled";

export const StepperOnboarding = () => {
  const pathname = usePathname();
  const currentStep = pathname.split("/").at(-1) as
    | "start"
    | "connection"
    | "create-site";

  const currentStepNumber = STEPS_ONBOARDING_CONFIG[currentStep].step;

  const isDesktop = useResponsive("up", "sm");

  const progressPercentage = (currentStepNumber / 3) * 100;

  return (
    <Container>
      <StepperWrap>
        {isDesktop ? (
          <Stepper activeStep={currentStepNumber - 1} alternativeLabel>
            {Object.values(STEPS_ONBOARDING_CONFIG).map(({ title, slug }) => (
              <Step key={slug}>
                <StepLabel>{title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : (
          <>
            <Step active index={currentStepNumber - 1}>
              <StepLabel
                optional={
                  <Typography variant="caption">
                    Step {currentStepNumber} of 3
                  </Typography>
                }
              >
                {STEPS_ONBOARDING_CONFIG[currentStep].title}
              </StepLabel>
            </Step>

            <StepperProgress
              color="decorate"
              variant="determinate"
              value={progressPercentage}
            />
          </>
        )}
      </StepperWrap>
    </Container>
  );
};
