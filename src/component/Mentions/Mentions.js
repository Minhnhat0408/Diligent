import { Mention, MentionsInput } from 'react-mentions';
import classNames from 'classnames/bind'
import styles from './Mentions.module.scss'
const cx = classNames.bind(styles)
function Mentions({ onKeyDown,inpRef,value,cmt,reply, data, onBlur,onChange,placeholder,dark,disabled }) {
    
    return (
            <MentionsInput
                disabled={disabled}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={inpRef}
                className={( cmt && 'mentions mentions--multiLine cmt') || (( reply && 'mentions mentions--multiLine reply'))}
                onKeyDown={onKeyDown}
                classNames={styles}
                style={dark ? {backgroundColor: 'var(--bg-dark-theme)',borderRadius:'20px',color:'var(--text-color-dark)'} : {backgroundColor: '#eee',borderRadius:'20px',color:'var(--text-color)'}}
                a11ySuggestionsListLabel='Suggested mentions'
                placeholder={placeholder}
                customSuggestionsContainer={(children)=><div className={cx('container',{dark})}>{children}</div>}
            >
                <Mention
                    markup="@__display__(__id__)"
                    trigger="@"
                    data={data}
                    className={cx('mentions__mention',{dark})}
                    renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                        <div className={cx('user')}>{highlightedDisplay}</div>
                    )}
                    displayTransform={(id,display) => {
                        return `@${display}`
                    }}
                />
         
            </MentionsInput>
  
    );
}

export default Mentions;