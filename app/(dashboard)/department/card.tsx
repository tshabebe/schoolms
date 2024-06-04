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
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newSection } from "./action";

export function Departments({
  department,
  id,
  section,
}: {
  department: string;
  id: number;
  section: z.infer<typeof SelectSectionSchema>[];
}) {
  return (
    <div>
      <Card>
        <CardHeader className="justify-between">
          {department}
          <AddSection id={id} />
          <CardBody>
            <div>{section.length}</div>
          </CardBody>
        </CardHeader>
      </Card>
    </div>
  );
}

function AddSection({ id }: { id: number }) {
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
const newSectionSchema = InsertSectionSchema.omit({ department: true });
function ValidateInput({ id }: { id: number }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newSectionSchema>
  >({
    resolver: zodResolver(newSectionSchema),
  });

  const [isPending, setTransition] = useTransition();

  function submit(datap: z.infer<typeof newSectionSchema>) {
    setTransition(async () => {
      await newSection(datap.sectionName, id);
    });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("sectionName")}
        placeholder="Enter section"
        errorMessage={formState.errors.sectionName?.message}
        isInvalid={(formState.errors.sectionName && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
