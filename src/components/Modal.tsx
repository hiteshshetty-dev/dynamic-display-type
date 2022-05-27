import React from 'react'
import { ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, Checkbox, Field } from '@contentstack/venus-components'

const Modal = (props: any) => {
    const [checked, setChecked] = React.useState(props.element?.attrs?.inline || false)
    const handleChange = (e: any) => {
        setChecked(e.target.checked)
    }
    const handleSave = () => {
        const prevState = props.element?.attrs?.inline || false
        const parentPath = props.path.slice(0, -1)
        const [parentNode,] = props.rte.getNode(parentPath)
        if(checked !== prevState) {
            if(checked) {
                let shouldWrap = Array.from(parentNode.children).some((sibling:any) => {
                    if(sibling.uid === props.element.uid){
                        return false
                    }
                    return !props.rte._adv.editor.isInline(sibling)
                })
                if (shouldWrap) {
                    props.rte.wrapNode({ type: "p", attrs: {} }, { at: props.path })
                    const newPath = [...props.path, 0]
                    props.rte.updateNode('dynamic-type', { inline: checked }, { at: newPath })
                }else{
                    props.rte.updateNode('dynamic-type', { inline: checked }, { at: props.path })
                }
            }else{
                props.rte._adv.Editor.withoutNormalizing(props.rte._adv.editor, () => {
                    props.rte.updateNode('dynamic-type', { inline: checked }, { at: props.path })
                    if (parentNode.type === 'p') {
                        props.rte.unWrapNode({ at: props.path,match: (node:any) => node.type === 'p'  })
                    }
                })
                
            }
        }

        props.closeModal()
    }
    return (
        <div id="inline-notice-modal">
            <ModalHeader title="Edit Info" closeModal={props.closeModal} />

            <ModalBody className="flex flex-v-center flex-h-center">
                    <Field>
                        <Checkbox
                            style={{ padding: '0.6rem' }}
                            checked={checked}
                            label="Inline Info"
                            name="inline"
                            onChange={handleChange}
                        />
                    </Field>

            </ModalBody>

            <ModalFooter>
                <ButtonGroup>
                    <Button onClick={props.closeModal} buttonType="light">
                        Cancel
                    </Button>
                    <Button icon='Save' onClick={handleSave}>Save</Button>
                </ButtonGroup>
            </ModalFooter>
        </div>
    )
}

export default Modal