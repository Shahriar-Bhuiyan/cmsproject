"use client";
import * as z from "zod";
import { Billboard } from "@prisma/client";
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
  lable: z.string().min(1),
  imageUrl: z.string().min(1)
});

interface BillboardFormProps {
  initalData: Billboard | null;
}

type BillboardFromValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ initalData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const origin = useOrigin();
  const [loading, setLoading] = useState(false);

  const title = initalData ? "Edit billboard" : "Create Billboard";
  const description = initalData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initalData ? "Billboard updated" : "Billboard created";
  const action = initalData ? "Save Changes" : "Create";

  const form = useForm<BillboardFromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initalData || {
      lable: "",
      imageUrl: ""
    }
  });

  const onsubmit = async (data: BillboardFromValues) => {
    try {
      setLoading(true);
      if(initalData){
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardid}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`)
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

      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardid}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard Deleted successfully");
    } catch (error) {
      toast.error("Make sure you remove all categories using this billboards");
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
          <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload  value={field.value ? [field.value]:[]}
                    disabled={loading}
                    onChange={(url)=>field.onChange(url)}
                    onRemove={()=>field.onChange('')}

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="lable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lable</FormLabel>
                  <FormControl>
                    <Input
                      disabled={false}
                      placeholder="Billboard label"
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
