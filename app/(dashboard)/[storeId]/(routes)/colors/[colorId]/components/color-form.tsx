"use client";
import * as z from "zod";
import { Color } from "@prisma/client";
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
  value: z.string().min(4).regex(/^#/,{message:'String must be a valid Hex Code'})
});

interface ColorFormProps {
  initalData: Color | null;
}

type ColorFromValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ initalData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const origin = useOrigin();
  const [loading, setLoading] = useState(false);

  const title = initalData ? "Edit Color" : "Create Color";
  const description = initalData ? "Edit a Color" : "Add a new Color";
  const toastMessage = initalData ? "Color updated" : "Color created";
  const action = initalData ? "Save Changes" : "Create";

  const form = useForm<ColorFromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initalData || {
      name: "",
      value: ""
    }
  });

  const onsubmit = async (data: ColorFromValues) => {
    try {
      setLoading(true);
      if(initalData){
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`)
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

      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Color is Deleted successfully");
    } catch (error) {
      toast.error("Make sure you remove all categories using this color");
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
                      placeholder="Color Name"
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
                   <div className="flex items-center gap-x-4">
                   <Input
                      disabled={false}
                      placeholder="Color Value"
                      {...field}
                    />
                  <div className="border h-6 w-6 rounded-full p-5 " style={{background:field.value}}/>
                   </div>
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
