"use client";
import { InsertSectionSchema, SelectSectionSchema } from "@/app/_db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

export function Departments({
  department,
  id,
  section,
}: {
  department: string;
  id: string;
  section: z.infer<typeof SelectSectionSchema>[];
}) {
  console.log(section);
  const router = useRouter();
  return (
    <div>
      <Card>
        <CardHeader className="justify-between">
          {department}
          <AddSection id={id} />
        </CardHeader>
        <CardBody>
          <div>{section && section.length} sections</div>
          <Button onClick={() => router.push(`department/${id}/section/`)}>
            view
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

function AddSection({ id }: { id: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm">
        new section
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <ValidateInput id={id} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
const newSectionSchema = InsertSectionSchema.omit({ departmentId: true });
function ValidateInput({ id }: { id: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newSectionSchema>
  >({
    resolver: zodResolver(newSectionSchema),
  });

  const queryClient = useQueryClient();
  const departmentsKey = getQueryKey(api.departmentRouter.createDepartment);

  const newSection = api.sectionRouter.createSection.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentsKey });
    },
  });

  function submit(data: z.infer<typeof newSectionSchema>) {
    newSection.mutate({ ...data, departmentId: id });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("name")}
        placeholder="Enter section"
        errorMessage={formState.errors.name?.message}
        isInvalid={(formState.errors.name && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
