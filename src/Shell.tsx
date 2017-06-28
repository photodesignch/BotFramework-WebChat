import * as React from 'react';
import { ChatActions, ChatState, FormatState } from './Store';
import { User } from 'botframework-directlinejs';
import { sendMessage, sendFiles } from './Chat';
import { Dispatch, connect } from 'react-redux';
import { Strings } from './Strings';

interface Props {
    inputText: string,
    strings: Strings,

    onChangeText: (inputText: string) => void

    sendMessage: (inputText: string) => void,
    sendFiles: (files: FileList) => void,
}

class ShellContainer extends React.Component<Props, {}> {
    private textInput: HTMLInputElement;
    private fileInput: HTMLInputElement;

    constructor(props: Props) {
        super(props);
    }

    private sendMessage() {
        if (this.props.inputText.trim().length > 0)
            this.props.sendMessage(this.props.inputText);
    }

    private onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter')
            this.sendMessage();
    }

    private onClickSend() {
        this.textInput.focus();
        this.sendMessage();
    }

    private onChangeFile() {
        this.textInput.focus();
        this.props.sendFiles(this.fileInput.files);
        this.fileInput.value = null;
    }

    render() {
        let className = 'wc-console';
        if (this.props.inputText.length > 0) className += ' has-text';

        return (
            <div className={className}>
                <input id="wc-upload-input" type="file" ref={ input => this.fileInput = input } multiple onChange={ () => this.onChangeFile() } />
                <label className="wc-upload" htmlFor="wc-upload-input">
                    <svg viewBox="0 0 15 12.01">
                        <path d="M12,0V9H0V0ZM.75.75v4L3.38,2.1,7.13,5.85l1.5-1.5L11.25,7V.75Zm0,7.5H8.47L3.38,3.15.75,5.78Zm10.5,0V8L8.63,5.4l-1,1L9.53,8.25ZM9.38,3a.37.37,0,0,1-.26-.64.37.37,0,1,1,.53.53A.36.36,0,0,1,9.38,3Z" />
                    </svg>
                </label>
                <div className="wc-textbox">
                    <input
                        type="text"
                        className="wc-shellinput"
                        ref={ input => this.textInput = input }
                        autoFocus
                        value={ this.props.inputText }
                        onChange={ _ => this.props.onChangeText(this.textInput.value) }
                        onKeyPress={ e => this.onKeyPress(e) }
                        placeholder={ this.props.strings.consolePlaceholder }
                    />
                </div>
                <label className="wc-send" onClick={ () => this.onClickSend() } >
                    <svg viewBox="0 0 15 12.01">
                        <path d="M0 7.93L1.32 4 0 0l11.9 4zm2-4.34h6.41L1.18 1.18zm-.8 3.16l7.21-2.41H2z" />
                    </svg>
                </label>
            </div>
        );
    }
}

export const Shell = connect(
    (state: ChatState) => ({
        // passed down to ShellContainer
        inputText: state.shell.input,
        strings: state.format.strings,
        // only used to create helper functions below 
        locale: state.format.locale,
        user: state.connection.user,
    }), {
        // passed down to ShellContainer
        onChangeText: (input: string) => ({ type: 'Update_Input', input } as ChatActions),
        // only used to create helper functions below 
        sendMessage,
        sendFiles
    }, (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // from stateProps
        inputText: stateProps.inputText,
        strings: stateProps.strings,
        // from dispatchProps
        onChangeText: dispatchProps.onChangeText,
        // helper functions
        sendMessage: (text: string) => dispatchProps.sendMessage(text, stateProps.user, stateProps.locale),
        sendFiles: (files: FileList) => dispatchProps.sendFiles(files, stateProps.user, stateProps.locale)
    })
)(ShellContainer);
