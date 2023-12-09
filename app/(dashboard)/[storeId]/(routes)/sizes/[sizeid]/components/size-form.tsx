"use client";
import * as z from "zod";
import { Billboard, Size } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { init } from "next/dist/compiled/webpack/webpack";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
});

interface SizeFormProps {
  initalData: Size | null;
}

type SizeFromValues = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SizeFormProps> = ({ initalData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const origin = useOrigin();
  const [loading, setLoading] = useState(false);

  const title = initalData ? "Edit Size" : "Create Size";
  const description = initalData ? "Edit a Size" : "Add a new Size";
  const toastMessage = initalData ? "Size updated" : "Size created";
  const action = initalData ? "Save Changes" : "Create";

  const form = useForm<SizeFromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initalData || {
      name: "",
      value: ""
    }
  });

  const onsubmit = async (data: SizeFromValues) => {
    try {
      setLoading(true);
      if(initalData){
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeid}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage);
      console.log(params);
    } catch (error) {
      toast.error("Something is wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeid}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size is Deleted successfully");
    } catch (error) {
      toast.error("Make sure you remove all categories using this Size");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initalData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className="space-y-8 w-full"
        >
          
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={false}
                      placeholder="Size Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={false}
                      placeholder="Size Value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
           {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
