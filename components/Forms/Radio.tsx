import { Error } from './Error'
import { InputHTMLAttributes } from 'react'
import { TypedKeyAndText } from '../../i18n/api'
import { Tooltip } from '../Tooltip/tooltip'
import { QuestionLabel } from './QuestionLabel'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  keyforid: string
  values: TypedKeyAndText<string>[]
  label: string
  checkedValue?: string
  helpText?: string
  error?: string
  requiredText?: string
  setValue(value: string): void
}

/**
 * A form input radio field that is rendered by the component factory.
 * @param props {InputProps}
 * @returns
 */
export const Radio: React.VFC<InputProps> = ({
  name,
  label,
  checkedValue,
  onChange,
  values,
  keyforid,
  helpText,
  error,
  requiredText,
  setValue,
}) => {
  return (
    <div className="radio">
      <fieldset>
        <legend>
          <QuestionLabel
            name={name}
            type="radio"
            label={label}
            requiredText={requiredText}
            helpText={helpText}
          />
        </legend>
        <div role="radiogroup" className="mt-2.5">
          {values.map((val, index) => (
            <div
              key={index}
              id={`${name}-r${index}`}
              className="flex items-center mb-2 md:mb-[12px] last:mb-0 hover:cursor-pointer"
            >
              <input
                className={`hover:cursor-pointer ${
                  error ? '!border-danger' : ''
                }`}
                type="radio"
                data-testid="radio"
                id={`${keyforid}-${index}`}
                name={`${keyforid}`}
                value={val.key}
                onChange={onChange}
                checked={checkedValue === correctForBooleans(val.key)}
              />
              <label
                htmlFor={`${keyforid}-${index}`}
                className="flex items-center focus:inherit text-content hover:cursor-pointer"
              >
                {<span dangerouslySetInnerHTML={{ __html: val.text }} />}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      {error && (
        <div className="mt-2">
          <Error errorMessage={error} />
        </div>
      )}
    </div>
  )
}

const correctForBooleans = (value: string) => {
  switch (value) {
    case 'Yes':
      return 'true'
    case 'No':
      return 'false'
    case 'Oui':
      return 'true'
    case 'Non':
      return 'false'
    default:
      return value
  }
}
