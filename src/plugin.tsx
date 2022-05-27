/** @jsx jsx */
//@ts-nocheck
import { jsx } from "@emotion/core";
import ContentstackSDK from "@contentstack/app-sdk";
import { Icon,cbModal } from '@contentstack/venus-components'

import Modal from './components/Modal'
import "./style.css"
export default ContentstackSDK.init().then(async (sdk) => {
    const extensionObj = await sdk["location"];
    const RTE = await extensionObj["RTEPlugin"]
    if (!RTE) return;

    const DynamicElementType = RTE('dynamic-type', (rte) => {
        // override isInline method to return true for dynamic-type element
        const inline = rte._adv.editor.isInline
        rte._adv.editor.isInline = (element:any) => {
            if(element.type === 'dynamic-type' && element.attrs.inline) {
                return true
            }
            return inline(element)
        }
        //
        const handleClick = (newRte:any,element:any,path:any) => {
            cbModal({
                component: (extraProps:any) => <Modal {...extraProps} rte={newRte} path={path} element={element}/>,
                modalProps: {
                    size: 'xsmall',
                    customClass: 'info__modal',
                    shouldReturnFocusAfterClose: false
                }
            })
        }

        return {
            title: "Dynamic Type",
            elementType: ["block"],
            icon: <Icon className='pr-6' icon="Edit" size="original" />,
            render: (props:any) => {
                const isInline = props.element?.attrs?.inline || false
                const ElementType = isInline ? 'span' : 'div'
                const ElementWrapper = isInline ? 'span' : 'p'
                const infoClass = isInline ? 'info__inline' : 'info'
                return (
                    <ElementWrapper {...props.attrs} className={`${infoClass} info__wrapper`}>
                        <ElementType contentEditable="false" className='p-t-1' onClick={() => handleClick(props.rte,props.element,props.slatePath)}>
                            <Icon className='p-x-6' icon="InfoCircleWhite" size="original" />
                        </ElementType>
                        <ElementType className={isInline ? "" : 'info__content'}>
                            {props.children}
                        </ElementType>
                    </ElementWrapper>
                )
            },
            displayOn: ["toolbar"]
        }
    })
    DynamicElementType.on('beforeRender',(rte) => {
        if(rte.element.type === 'dynamic-type' && rte.element.attrs.inline) {
            rte.DisableDND = true
            rte.DisableSelectionHalo = true
        }
    })
    return {
        DynamicElementType
    };
});
