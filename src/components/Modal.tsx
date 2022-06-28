import React from 'react'
import { ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, Checkbox, Field } from '@contentstack/venus-components'
import { flattenDeep } from 'lodash'

const generateFragment = (child:any) => ({
    type: 'fragment',
    attrs:{},
    children: [child]
})
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
                let parentChildren = Array.from(parentNode.children).map((child:any) => {
                    if(child && child.hasOwnProperty('type') && child.type === 'dynamic-type'){
                        return {...child,attrs:{inline:checked}}
                    }
                    if(child && child.hasOwnProperty('type') && child.type === 'fragment'){
                        return child.children
                    }
                    return child
                })
                parentChildren = flattenDeep(parentChildren)                
                props.rte.removeNode(parentNode)
                props.rte.insertNode({...parentNode,children: parentChildren}, { at: parentPath })

            }else{
                let parentChildren = Array.from(parentNode.children).map((child:any) => {
                    if(child && child.hasOwnProperty('type') && child.type === 'dynamic-type'){
                        return {...child,attrs:{inline:checked}}
                    }
                    if(props.rte._adv.editor.isInline(child) || child.hasOwnProperty('text')){
                        return generateFragment(child)
                    }
                    return child
                })
                props.rte.removeNode(parentNode)
                props.rte.insertNode({...parentNode,children: parentChildren}, { at: parentPath })
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