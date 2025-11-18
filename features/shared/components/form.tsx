import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // Assuming you have a utility for merging class names
import { ReactNode } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

type FieldOrientation = "horizontal" | "vertical" | "responsive";
type FormControlBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName>["control"];
  orientation?: FieldOrientation;
  controlFirst?: boolean;
  className?: string;
};

type CustomControllerRenderField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Parameters<ControllerProps<TFieldValues, TName>["render"]>[0]["field"] & {
  "aria-invalid": boolean;
  id: string;
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormControlBaseProps<TFieldValues, TName> & {
  children: (
    field: CustomControllerRenderField<TFieldValues, TName>
  ) => ReactNode;
};

type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormControlBaseProps<TFieldValues, TName> & ExtraProps
) => ReactNode;

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  children,
  control,
  label,
  name,
  description,
  controlFirst,
  orientation = "vertical",
  className,
}: FormBaseProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const id = field.name;

        const labelElement = (
          <>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );

        const controlElement = children({
          ...field,
          id: id,
          "aria-invalid": fieldState.invalid,
        });

        const errorElement = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        if (controlFirst) {
          return (
            <Field
              data-invalid={fieldState.invalid}
              orientation={orientation}
              className={className}
            >
              {controlElement}
              <FieldContent className="w-full">
                {labelElement}
                {errorElement}
              </FieldContent>
            </Field>
          );
        }

        const controlErrorGroup = (
          <div
            className={cn(
              "flex flex-col gap-1.5",
              "w-full",
              orientation === "horizontal" && "sm:flex-1",
              orientation === "responsive" && "@md/field-group:flex-1"
            )}
          >
            {controlElement}
            {errorElement}
          </div>
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={orientation}
            className={className}
          >
            <FieldContent className={cn("w-full", "flex-1/3")}>
              {labelElement}
            </FieldContent>

            {controlErrorGroup}
          </Field>
        );
      }}
    />
  );
}

type InputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "name" | "value" | "onChange" | "onBlur" | "ref" | "id" | "aria-invalid"
>;

export const FormInput: FormControlFunc<InputProps> = ({
  placeholder,
  autoComplete,
  type,
  className: inputClassName,
  disabled,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Input
          {...field}
          placeholder={placeholder}
          autoComplete={autoComplete}
          type={type}
          className={inputClassName}
          disabled={disabled}
        />
      )}
    </FormBase>
  );
};

type TextareaProps = Omit<
  React.ComponentPropsWithoutRef<typeof Textarea>,
  "name" | "value" | "onChange" | "onBlur" | "ref" | "id" | "aria-invalid"
>;

export const FormTextarea: FormControlFunc<TextareaProps> = ({
  placeholder,
  rows,
  className: textareaClassName,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Textarea
          {...field}
          placeholder={placeholder}
          rows={rows}
          className={textareaClassName}
        />
      )}
    </FormBase>
  );
};

export const FormSelect: FormControlFunc<{
  children: ReactNode;
  placeholder?: string;
  className?: string;
}> = ({ children, placeholder, className: selectClassName, ...props }) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ref, value, ...field }) => (
        <Select {...field} value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger
            aria-invalid={field["aria-invalid"]}
            id={field.id}
            onBlur={onBlur}
            ref={ref}
            className={cn("w-full", selectClassName)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
};

export const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase {...props} orientation="horizontal" controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={!!value} onCheckedChange={onChange} />
      )}
    </FormBase>
  );
};
