import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "@/components/icons";
import PanelVideo from "@/components/panel-video";
import PTZControl from "@/components/ptz-control";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Stepper } from "@/components/ui/stepper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { streamService } from "@/api";
import { toast } from "@/hooks/use-toast";

const patrolSchema = z.object({
  zMin: z.number().nullable(),
  zMax: z.number().nullable(),
  xMin: z.number().nullable(),
  xMax: z.number().nullable(),
  yMin: z.number().nullable(),
  yMax: z.number().nullable(),
});

type PatrolFormData = z.infer<typeof patrolSchema>;

function SetValueButton({
  onClick,
  disable,
  children,
  tooltipContent,
}: {
  onClick: (data: { x: number; y: number; z: number }) => void;
  disable: boolean;
  children: React.ReactNode;
  tooltipContent?: string;
}) {
  const { streamId } = useParams();

  const { mutate: getPtzPosition, isPending } = useMutation({
    mutationFn: streamService.getPtzPosition,
    onSuccess: ({ data }) => {
      onClick(data);
    },
    onError: (err) => {
      console.log("Error: ", err);
      //   toast({
      //     description: t("stream.alert.autoTrackError"),
      //     variant: "destructive",
      //   });
    },
  });

  if (!streamId) return null;

  return disable ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <Button disabled={disable}>{children}</Button>
        </TooltipTrigger>
        <TooltipContent className={cn(!tooltipContent && "hidden")}>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Button onClick={() => getPtzPosition(streamId)} loading={isPending}>
      {children}
    </Button>
  );
}

function PatrolAreaPage() {
  const { t } = useTranslation();
  const { streamId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const { mutate: setPatrolArea, isPending } = useMutation({
    mutationFn: streamService.setPatrolArea,
    onSuccess: () => {
      navigate(-1);
      toast({
        description: "Patrol area set successfully",
        variant: "success",
      });
    },
    onError: (err) => {
      console.log("Error: ", err);
      toast({
        description: "Error setting patrol area",
        variant: "destructive",
      });
    },
  });

  const steps = [
    { title: "Zoom", description: "Set the zoom level", key: "z" },
    {
      title: "Pan",
      description: "Set the pan position",
      key: "x",
    },
    { title: "Tilt", description: "Set the tilt position", key: "y" },
  ];

  const form = useForm<PatrolFormData>({
    resolver: zodResolver(patrolSchema),
    defaultValues: {
      zMin: undefined,
      zMax: undefined,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
    },
  });
  const { setValue, watch, getValues } = form;
  const { zMin, zMax, xMin, xMax, yMin, yMax } = watch();

  const getStepValues = (key: string) => {
    const values = {
      z: { min: zMin, max: zMax },
      x: { min: xMin, max: xMax },
      y: { min: yMin, max: yMax },
    };
    return values[key as keyof typeof values];
  };

  type FormField = "zMin" | "zMax" | "xMin" | "xMax" | "yMin" | "yMax";

  if (!streamId) {
    return navigate(-1);
  }

  const handleSavePatrolArea = () => {
    const { zMin, zMax, xMin, xMax, yMin, yMax } = getValues();

    if (
      zMin === null ||
      zMax === null ||
      xMin === null ||
      xMax === null ||
      yMin === null ||
      yMax === null
    )
      return;

    setPatrolArea({
      streamId,
      patrolArea: {
        zMin,
        zMax,
        xMin,
        xMax,
        yMin,
        yMax,
      },
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Icons.arrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
          <h1 className="text-xl font-semibold">Set Patrol Area</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("stream.streamId")}: {streamId}
        </p>
      </div>

      <div>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
        <div className="mx-auto w-full lg:max-w-5xl mt-2 rounded-md overflow-hidden relative aspect-[16/9]">
          <PanelVideo streamId={streamId} />
          <div
            className={cn(
              "absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between py-5"
            )}
          >
            <div />
            <PTZControl streamId={streamId} />
            <div className="flex justify-between items-center  px-5 ">
              <Button
                variant="outline"
                onClick={() => {
                  setValue(`${steps[currentStep].key}Min` as FormField, null);
                  setValue(`${steps[currentStep].key}Max` as FormField, null);
                }}
                disabled={!getStepValues(steps[currentStep].key).min}
              >
                Reset
              </Button>
              <div className="flex justify-end items-end gap-2">
                {steps.map(
                  (step, index) =>
                    currentStep === index && (
                      <div key={step.key} className="flex gap-2">
                        <SetValueButton
                          onClick={({ x, y, z }) =>
                            setValue(
                              `${step.key}Min` as FormField,
                              step.key === "x" ? x : step.key === "y" ? y : z
                            )
                          }
                          disable={!!getStepValues(step.key).min}
                          tooltipContent={
                            getStepValues(step.key).min
                              ? `${step.title} min: ${
                                  getStepValues(step.key).min
                                }`
                              : undefined
                          }
                        >
                          Set minimum
                        </SetValueButton>
                        <SetValueButton
                          onClick={({ x, y, z }) =>
                            setValue(
                              `${step.key}Max` as FormField,
                              step.key === "x" ? x : step.key === "y" ? y : z
                            )
                          }
                          disable={
                            !getStepValues(step.key).min ||
                            !!getStepValues(step.key).max
                          }
                          tooltipContent={
                            getStepValues(step.key).max
                              ? `${step.title} max: ${
                                  getStepValues(step.key).max
                                }`
                              : undefined
                          }
                        >
                          Set maximum
                        </SetValueButton>
                        <Button
                          disabled={
                            !getStepValues(step.key).min ||
                            !getStepValues(step.key).max
                          }
                          onClick={() =>
                            index < steps.length - 1
                              ? setCurrentStep(index + 1)
                              : handleSavePatrolArea()
                          }
                          loading={isPending}
                        >
                          {index === steps.length - 1 ? (
                            "Save"
                          ) : (
                            <Icons.arrowRight />
                          )}
                        </Button>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatrolAreaPage;
