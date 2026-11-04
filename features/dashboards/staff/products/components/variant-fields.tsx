"use client";

import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface VariantFieldsProps {
  name: string;
  multiple?: boolean;
  minItems?: number;
}

function AttributeRows({ variantIndex }: { variantIndex: number }) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.attributes`,
  });

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Attributes (e.g., Color, Size)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ key: "", value: "" })}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No attributes added.</p>
      )}

      {fields.map((fieldItem, idx) => {
        // Direct safe access with optional chaining
        const attrError = (errors.variants as any)?.[variantIndex]?.attributes?.[idx];
        const keyError = attrError?.key?.message;
        const valueError = attrError?.value?.message;

        return (
          <div key={fieldItem.id} className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
              <Input placeholder="Key (e.g. Size)" {...register(`variants.${variantIndex}.attributes.${idx}.key`)} />
              {keyError && <p className="text-xs text-red-500">{keyError}</p>}
            </div>
            <div className="flex-1 space-y-1">
              <Input placeholder="Value (e.g. Large)" {...register(`variants.${variantIndex}.attributes.${idx}.value`)} />
              {valueError && <p className="text-xs text-red-500">{valueError}</p>}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive shrink-0"
              onClick={() => remove(idx)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function SingleVariantForm({ prefix, index }: { prefix: string; index?: number }) {
  const { register, control, formState: { errors } } = useFormContext();

  // Safe error extraction based on whether it's an array or single variant
  const variantErrors = index !== undefined 
    ? (errors.variants as any)?.[index] 
    : errors[prefix] as any;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Variant Name *</Label>
          <Input placeholder="e.g. Red / XL" {...register(`${prefix}.variant_name`)} />
          {variantErrors?.variant_name?.message && (
            <p className="text-xs text-red-500">{variantErrors.variant_name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>SKU *</Label>
          <Input placeholder="Unique SKU" {...register(`${prefix}.sku`)} />
          {variantErrors?.sku?.message && (
            <p className="text-xs text-red-500">{variantErrors.sku.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Price *</Label>
          <Input type="number" step="0.01" {...register(`${prefix}.price`, { valueAsNumber: true })} />
          {variantErrors?.price?.message && (
            <p className="text-xs text-red-500">{variantErrors.price.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Base Price (USD)</Label>
          <Controller
            control={control}
            name={`${prefix}.base_price_usd`}
            render={({ field }) => (
              <Input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
              />
            )}
          />
          {variantErrors?.base_price_usd?.message && (
            <p className="text-xs text-red-500">{variantErrors.base_price_usd.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Stock Quantity *</Label>
          <Input type="number" {...register(`${prefix}.stock_quantity`, { valueAsNumber: true })} />
          {variantErrors?.stock_quantity?.message && (
            <p className="text-xs text-red-500">{variantErrors.stock_quantity.message}</p>
          )}
        </div>
      </div>

      {index !== undefined && <AttributeRows variantIndex={index} />}
    </div>
  );
}

export function VariantFields({ name, multiple = false, minItems = 1 }: VariantFieldsProps) {
  const { control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  if (!multiple) {
    return <SingleVariantForm prefix={name} />;
  }

  const arrayError = (errors[name] as any)?.message;

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardHeader className="py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Variant #{index + 1}</CardTitle>
            {fields.length > minItems && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <SingleVariantForm prefix={`${name}.${index}`} index={index} />
          </CardContent>
        </Card>
      ))}
      
      {arrayError && <p className="text-xs text-red-500">{arrayError}</p>}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ variant_name: "", sku: "", price: 0, stock_quantity: 0, attributes: [] })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Variant
      </Button>
    </div>
  );
}