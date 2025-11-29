"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { FileText, Upload, XIcon } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { toast } from "sonner";
import { useDropzone } from "../../hooks/use-dropzone";
import { QUIZ_CONFIG } from "../../lib/config";
import { CreateQuizSchemaType } from "../../lib/types";

interface FileUploadFieldProps {
  isGenerating: boolean;
  control: Control<CreateQuizSchemaType>;
}

export default function FileUploadField({
  control,
  isGenerating,
}: FileUploadFieldProps) {
  return (
    <Controller
      name="file"
      control={control}
      render={({ field: { onChange, value: file }, fieldState }) => {
        const { getRootProps, getInputProps, isDragActive, isDragReject } =
          useDropzone({
            accept: QUIZ_CONFIG.FILE.ACCEPTED_TYPES,
            maxSize: QUIZ_CONFIG.FILE.MAX_SIZE,
            onDrop: (accepted, rejected) => {
              if (rejected.length) {
                toast.error("Invalid file type or size");
                return;
              }
              if (accepted.length > 1) {
                toast.error("Please upload only one file");
                return;
              }
              onChange(accepted[0] || null);
            },
          });

        return (
          <Field data-invalid={fieldState.invalid}>
            <div
              {...getRootProps()}
              className={cn(
                "relative rounded-lg border-2 border-dashed p-6 md:p-8 transition-colors cursor-pointer outline-none",
                isDragActive && "border-primary bg-accent",
                isGenerating && "opacity-50 cursor-not-allowed",
                isDragReject && "border-destructive bg-destructive/10",
                fieldState.invalid && "border-destructive",
                !isDragActive &&
                  !fieldState.invalid &&
                  "border-border hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} disabled={isGenerating} />

              <div className="flex flex-col items-center gap-4 pointer-events-none ">
                {file ? (
                  <>
                    <FileText className="h-12 w-12 text-primary" />
                    <div className="text-center">
                      <p className="font-semibold text-sm md:text-base">
                        {file.name}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-semibold text-sm md:text-base">
                        {isDragActive
                          ? "Drop here"
                          : "Drop PDF or click to browse"}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Max {QUIZ_CONFIG.FILE.MAX_SIZE / (1024 * 1024)}MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {file && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange(null)}
                aria-label="Remove file"
                disabled={isGenerating}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
