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
import { ReactNode } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  orientation?: "horizontal" | "vertical";
  controlFirst?: boolean;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
    >[0]["field"] & {
      "aria-invalid": boolean;
      id: string;
    }
  ) => ReactNode;
};

type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode;

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  control,
  label,
  name,
  description,
  controlFirst,
  orientation = "vertical",
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );

        const controlElement = children({
          ...field,
          id: field.name,
          "aria-invalid": fieldState.invalid,
        });

        const errorElement = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        return (
          <Field data-invalid={fieldState.invalid} orientation={orientation}>
            {controlFirst ? (
              <>
                {controlElement}
                <FieldContent>
                  {labelElement}
                  {errorElement}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {controlElement}
                {errorElement}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

// Input with additional props support
type InputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "name" | "value" | "onChange" | "onBlur" | "ref" | "id"
>;

export const FormInput: FormControlFunc<InputProps> = ({
  placeholder,
  autoComplete,
  type,
  className,
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
          className={className}
          disabled={disabled}
        />
      )}
    </FormBase>
  );
};

// Textarea with additional props support
type TextareaProps = Omit<
  React.ComponentPropsWithoutRef<typeof Textarea>,
  "name" | "value" | "onChange" | "onBlur" | "ref" | "id"
>;

export const FormTextarea: FormControlFunc<TextareaProps> = ({
  placeholder,
  rows,
  className,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Textarea
          {...field}
          placeholder={placeholder}
          rows={rows}
          className={className}
        />
      )}
    </FormBase>
  );
};

export const FormSelect: FormControlFunc<{
  children: ReactNode;
  placeholder?: string;
  orientation?: "horizontal" | "vertical";
}> = ({ children, placeholder, ...props }) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ref, value, ...field }) => (
        <Select {...field} value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger
            aria-invalid={field["aria-invalid"]}
            id={field.id}
            onBlur={onBlur}
            ref={ref}
            className="w-full sm:w-[150px]"
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
        <Checkbox
          {...field}
          checked={value ?? false}
          onCheckedChange={onChange}
        />
      )}
    </FormBase>
  );
};
