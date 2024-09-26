"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
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
import { newStudent } from "./action";
import { InsertStudentSchema, InsertTeacherSchema } from "@/app/_db/schema";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { InsertSubjectSchema } from "@/app/_db/schema";

export function AddStudents({ id }: { id: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const test = usePathname();

  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm">
        new students
      </Button>
      <Button onClick={() => router.push(`${test}/${id}/students`)}>
        go to studetns
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <ValidateStudentInput id={id} />
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

export function AddTeachers({ id }: { id: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const test = usePathname();
  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm">
        new teacher
      </Button>
      <Button onClick={() => router.push(`${test}/${id}/teachers`)}>
        go to teachers
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <ValidateTeacherInput id={id} />
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

export function AddSubjects({ id }: { id: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const test = usePathname();
  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm">
        new subjects
      </Button>
      <Button onClick={() => router.push(`${test}/${id}/subjects`)}>
        go to subjects
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <ValidateSubjectInput id={id} />
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

const newSubjectSchema = InsertSubjectSchema.omit({ sectionId: true });
function ValidateSubjectInput({ id }: { id: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newSubjectSchema>
  >({
    resolver: zodResolver(newSubjectSchema),
  });

  const queryClient = useQueryClient();

  const newSubjects = api.subjectRouter.createSubject.useMutation({
    onSuccess() {
      // TODO: invalidate were the teachers are listed
      // queryClient.invalidateQueries({queryKey: getQueryKey(api.departmentRouter.newDepartment)})
    },
  });

  function submit(datap: z.infer<typeof newSubjectSchema>) {
    newSubjects.mutate({ ...datap, sectionId: id });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("name")}
        placeholder="TeacherName"
        errorMessage={formState.errors.name?.message}
        isInvalid={(formState.errors.name && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSubjects.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}

const newTeacherSchema = InsertTeacherSchema.omit({ sectionId: true });
function ValidateTeacherInput({ id }: { id: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newTeacherSchema>
  >({
    resolver: zodResolver(newTeacherSchema),
  });

  const queryClient = useQueryClient();

  const newTeacher = api.sectionRouter.addStudent.useMutation({
    onSuccess() {
      // TODO: invalidate were the teachers are listed
      // queryClient.invalidateQueries({queryKey: getQueryKey(api.departmentRouter.newDepartment)})
    },
  });

  function submit(datap: z.infer<typeof newTeacherSchema>) {
    newTeacher.mutate({ ...datap, sectionId: id, name: "test" });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("name")}
        placeholder="TeacherName"
        errorMessage={formState.errors.name?.message}
        isInvalid={(formState.errors.name && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newTeacher.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}

const newStudentSchema = InsertStudentSchema.omit({ sectionId: true });

function ValidateStudentInput({ id }: { id: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newStudentSchema>
  >({
    resolver: zodResolver(newStudentSchema),
  });

  const [isPending, setTransition] = useTransition();

  function submit(datap: z.infer<typeof newStudentSchema>) {
    setTransition(async () => {
      await newStudent(datap.name, id);
    });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("name")}
        placeholder="StudentName"
        errorMessage={formState.errors.name?.message}
        isInvalid={(formState.errors.name && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
