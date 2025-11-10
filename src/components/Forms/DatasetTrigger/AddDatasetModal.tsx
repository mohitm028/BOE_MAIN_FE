import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Modal from "../../UI/Modal"
import { Button } from "../../UI"
import { FormTextField, FormCheckbox } from "../../common/TailwindStyledMuiComponents"
import { datasetTriggerSchema, DatasetTriggerFormData } from "../../../schemas/datasetTrigger.schema"

interface AddDatasetModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: DatasetTriggerFormData) => void
}

const AddDatasetModal = ({ isOpen, onClose, onAdd }: AddDatasetModalProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<DatasetTriggerFormData>({
    resolver: yupResolver(datasetTriggerSchema),
    defaultValues: {
      isNdmTransmission: true,
      sourceJobName: "",
      sourceJobLpar: "",
      ndmSourceNode: "",
      datasetName: "",
      triggerCondition: "",
      description: ""
    },
    mode: "onChange"
  })

  const watchedValues = watch()
  const { isNdmTransmission, sourceJobName, sourceJobLpar, ndmSourceNode } = watchedValues

  // Auto-generate dataset name when relevant fields change
  useEffect(() => {
    if (isNdmTransmission && sourceJobName && ndmSourceNode) {
      const generatedName = `${sourceJobName}.${ndmSourceNode}`
      setValue("datasetName", generatedName, { shouldValidate: true })
    } else if (!isNdmTransmission && sourceJobName && sourceJobLpar) {
      const generatedName = `${sourceJobName}.${sourceJobLpar}`
      setValue("datasetName", generatedName, { shouldValidate: true })
    } else if (!sourceJobName) {
      setValue("datasetName", "", { shouldValidate: true })
    }
  }, [isNdmTransmission, sourceJobName, sourceJobLpar, ndmSourceNode, setValue])

  const handleToggleNdm = (checked: boolean) => {
    setValue("isNdmTransmission", checked, { shouldValidate: true })
    if (!checked) {
      setValue("ndmSourceNode", "", { shouldValidate: true })
    } else {
      setValue("sourceJobName", "", { shouldValidate: true })
      setValue("sourceJobLpar", "", { shouldValidate: true })
    }
  }

  const handleSourceJobChange = (value: string) => {
    setValue("sourceJobName", value.toUpperCase(), { shouldValidate: true })
  }

  const handleSourceJobLparChange = (value: string) => {
    setValue("sourceJobLpar", value.toUpperCase(), { shouldValidate: true })
  }

  const handleNdmNodeChange = (value: string) => {
    setValue("ndmSourceNode", value.toUpperCase(), { shouldValidate: true })
  }

  const onSubmit = (data: DatasetTriggerFormData) => {
    onAdd(data)
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add File">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 space-y-4">
          {/* NDM Transmission Toggle */}
          <FormCheckbox
            name="isNdmTransmission"
            control={control}
            label="File transmitted through NDM transmission?"
            description="Check this if the file is transmitted through NDM transmission"
          />

          {/* Conditional fields based on NDM transmission */}
          {isNdmTransmission ? (
            <>
              {/* NDM Source Job Name */}
              <FormTextField
                name="sourceJobName"
                control={control}
                label="Enter source job or process name"
                placeholder="Enter source job or process name"
                required
                onChange={handleSourceJobChange}
              />
            </>
          ) : (
            <>
              {/* Non-NDM Source Job Name */}
              <FormTextField
                name="sourceJobName"
                control={control}
                label="Enter source job name"
                placeholder="JOBNAME1"
                required
                onChange={handleSourceJobChange}
              />
              
              {/* Source Job LPAR */}
              <FormTextField
                name="sourceJobLpar"
                control={control}
                label="Enter source job LPAR"
                placeholder="LPAR1"
                required
                onChange={handleSourceJobLparChange}
              />
            </>
          )}

          {/* NDM Source Node - Only show when NDM transmission is enabled */}
          {isNdmTransmission && (
            <FormTextField
              name="ndmSourceNode"
              control={control}
              label="Enter source NDM node"
              placeholder="NDM2"
              required
              onChange={handleNdmNodeChange}
            />
          )}

          {/* Dataset Name - Auto-generated and disabled */}
          <FormTextField
            name="datasetName"
            control={control}
            label="Dataset Name (Auto-generated)"
            disabled
            required
          />
          
          {/* Optional fields */}
          <FormTextField
            name="triggerCondition"
            control={control}
            label="Trigger Condition"
            placeholder="Optional trigger condition"
          />
          
          <FormTextField
            name="description"
            control={control}
            label="Description"
            placeholder="Optional description (max 255 characters)"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid}
            >
              Add
            </Button>
            <Button onClick={onClose} variant="secondary" type="button">
              Close
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default AddDatasetModal
