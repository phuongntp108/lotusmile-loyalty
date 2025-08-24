"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { CheckCircle, XCircle, Plane } from "lucide-react";
import { FetchError, ofetch } from "ofetch";
import { getAccessToken } from "@/helpers/access-token";

interface RequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const airports = [
  { code: "JFK", name: "John F. Kennedy International" },
  { code: "LAX", name: "Los Angeles International" },
  { code: "LHR", name: "London Heathrow" },
  { code: "CDG", name: "Charles de Gaulle" },
  { code: "NRT", name: "Narita International" },
  { code: "SYD", name: "Sydney Airport" },
  { code: "DXB", name: "Dubai International" },
  { code: "SIN", name: "Singapore Changi" },
  { code: "FRA", name: "Frankfurt am Main" },
  { code: "AMS", name: "Amsterdam Schiphol" },
];

type RequestForm = {
  flightCode: string;
  from: string;
  to: string;
  departureDate: string;
};

export default function RequestModal({
  open,
  onOpenChange,
}: RequestModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<RequestForm>({
    defaultValues: {
      flightCode: "",
      from: "",
      to: "",
    },
  });

  const watchedValues = watch(["flightCode", "from", "to"]);

  const createRequestMutation = useMutation({
    mutationFn: async (data: RequestForm) => {
      return ofetch("/api/request", {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your point request has been submitted successfully!",
      });
      onOpenChange(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["/api/request"] });
    },
    onError: (error: FetchError) => {
      toast({
        title: "Submission Failed",
        description: error.data.error || "Failed to submit request.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestForm) => {
    createRequestMutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Point Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label
              htmlFor="flightCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Flight Number
            </Label>
            <Input
              id="flightCode"
              {...register("flightCode", {
                required: "Flight number required",
              })}
              placeholder="SA1234"
            />
            {errors.flightCode && (
              <p className="text-red-500 text-sm">
                {errors.flightCode.message}
              </p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Airport
            </Label>
            <Controller
              name="from"
              control={control}
              rules={{ required: "Departure airport required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.code} value={a.code}>
                        {a.code} - {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.from && (
              <p className="text-red-500 text-sm">{errors.from.message}</p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Arrival Airport
            </Label>
            <Controller
              name="to"
              control={control}
              rules={{ required: "Arrival airport required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrival airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.code} value={a.code}>
                        {a.code} - {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.to && (
              <p className="text-red-500 text-sm">{errors.to.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="departureDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Departure Date
            </Label>
            <Input
              id="departureDate"
              type="date"
              {...register("departureDate")}
            />
          </div>

          <Button
            type="submit"
            disabled={createRequestMutation.isPending}
            className="w-full"
          >
            {createRequestMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
