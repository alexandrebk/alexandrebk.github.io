


Set default value

```ruby
# frozen_string_literal: true

# Sets default values on read.
# Most gems that do this sort of thing only apply default values when saving to database
# which is of no use for us.
module DefaultValueFor
  extend ActiveSupport::Concern

  included do
    @default_values = {}

    after_initialize :set_default_values

    def set_default_values
      self.class.default_values.each do |(attribute, hash)|
        next unless has_attribute?(attribute) && self[attribute].nil?

        value = hash[:value]
        condition = hash[:if]

        self[attribute] = _evaluate_default_value(value) if instance_exec(&condition)
      end
    end

    private

    def _evaluate_default_value(value)
      value.is_a?(Proc) ? value.call(self) : value
    end
  end

  class_methods do
    attr_reader :default_values

    # Defines the attributes that can have default values.
    #
    # Special *options* can be passed :
    #   - if: a Proc evaluated on the instance , allows to conditionally add defaults given a user-defined condition
    #   - allow_missing (default: true) : a Boolean which determines whether to raise a MissingAttributeError
    #     if the given attribute does not exist on the object
    #
    # Example usage :
    #
    #   class MyModel < ApplicationRecord
    #     include DefaultValueFor
    #
    #     default_value_for firstname: 'Jean-Claude',
    #                       lastname: 'van Damme',
    #                       if: -> { my_condition }
    #
    #     def my_condition
    #       ...
    #     end
    #   end
    def default_value_for(**options)
      allow_missing, condition = extract_options!(options)

      options.each do |(attribute, value)|
        unless allow_missing || has_attribute?(attribute)
          raise ActiveModel::MissingAttributeError, "missing attribute on #{self}: #{attribute}"
        end

        @default_values[attribute] = { value: value, if: condition }
      end
    end

    def extract_options!(options)
      [
        options.delete(:allow_missing) || false,
        options.delete(:if) || -> { true }
      ]
    end
  end
end
```
