using System;
using System.Collections.Generic;
using System.Linq;
using Componyx.UI;

namespace Componyx.UI.Tests
{
    /// <summary>
    /// Runs the FormValidator test cases (the same cases as form-validator.test.mjs) and writes PASS/FAIL per case to the console.
    /// Call FormValidatorTests.Run() from a console app or anywhere else.
    /// Definitions and values are written with single quotes for readability; J() turns them into valid JSON.
    /// </summary>
    public static class FormValidatorTests
    {
        private static int _passed;
        private static int _failed;

        public static void Run()
        {
            _passed = 0;
            _failed = 0;

            // required, static fields
            string basic = "[{'type':'FieldSet','id':'fs','fields':[{'type':'Field','id':'name','name':'name','required':true},{'type':'Field','id':'note','name':'note'}]}]";
            Check("required present", basic, "{'name':'Erik','note':null}", "");
            Check("required empty string", basic, "{'name':'','note':null}", "name:0");
            Check("required null", basic, "{'name':null,'note':null}", "name:0");
            Check("required missing key (static, tampered)", basic, "{'note':null}", "name:0");
            Check("optional missing key", basic, "{'name':'Erik'}", "");

            // data types
            string types = "[{'type':'FieldSet','id':'fs','fields':["
                + "{'type':'Field','id':'age','name':'age','validationSettings':{'dataType':0}},"
                + "{'type':'Field','id':'price','name':'price','validationSettings':{'dataType':1}},"
                + "{'type':'Field','id':'born','name':'born','validationSettings':{'dataType':2}},"
                + "{'type':'Field','id':'mail','name':'mail','validationSettings':{'dataType':3}},"
                + "{'type':'Field','id':'site','name':'site','validationSettings':{'dataType':4}}]}]";
            Check("valid data types", types, "{'age':'42','price':'9.95','born':'1980-05-17','mail':'a@b.nl','site':'https://componyx.com'}", "");
            Check("invalid data types", types, "{'age':'4.2','price':'abc','born':'2026-02-30','mail':'ab.nl','site':'componyx.com'}", "age:1|born:1|mail:1|price:1|site:1");
            Check("number value instead of string", types, "{'age':42,'price':9.95,'born':null,'mail':null,'site':null}", "");

            // length, range, pattern, compare
            string rules = "[{'type':'FieldSet','id':'fs','fields':["
                + "{'type':'Field','id':'code','name':'code','validationSettings':{'minLength':3,'maxLength':5}},"
                + "{'type':'Field','id':'qty','name':'qty','validationSettings':{'dataType':0,'minRange':1,'maxRange':10}},"
                + "{'type':'Field','id':'zip','name':'zip','validationSettings':{'pattern':'^[0-9]{4}[A-Z]{2}$'}},"
                + "{'type':'Field','id':'start','name':'start','validationSettings':{'dataType':2}},"
                + "{'type':'Field','id':'end','name':'end','validationSettings':{'dataType':2,'compareFieldId':'start','compareOperator':'>='}}]}]";
            Check("rules valid", rules, "{'code':'abcd','qty':'5','zip':'5741AB','start':'2026-01-01','end':'2026-02-01'}", "");
            Check("rules invalid", rules, "{'code':'ab','qty':'11','zip':'5741ab','start':'2026-03-01','end':'2026-02-01'}", "code:2|end:5|qty:3|zip:4");

            // options
            string options = "[{'type':'FieldSet','id':'fs','fields':["
                + "{'type':'Field','id':'gender','name':'gender','required':true,'options':[{'value':'f'},{'value':'m'}]},"
                + "{'type':'Field','id':'colors','name':'colors','options':[{'value':'red'},{'value':'blue'}]},"
                + "{'type':'Field','id':'level','name':'level','options':[{'value':1},{'value':2}]},"
                + "{'type':'Field','id':'free','name':'free','options':[{'value':'a'}],'componentSettings':{'allowInput':true}},"
                + "{'type':'Field','id':'remote','name':'remote','options':[{'value':'a'}],'dataSourceId':'ds1'}]}]";
            Check("options valid", options, "{'gender':'f','colors':['red','blue'],'level':'2','free':'zzz','remote':'zzz'}", "");
            Check("options invalid", options, "{'gender':'x','colors':['red','green'],'level':'3','free':null,'remote':null}", "colors:1|gender:1|level:1");

            string picks = "[{'type':'FieldSet','id':'fs','fields':[{'type':'Field','id':'picks','name':'picks','options':[{'value':'a'},{'value':'b'},{'value':'c'}],'validationSettings':{'minLength':2}}]}]";
            Check("multi-value length", picks, "{'picks':['a']}", "picks:2");

            // conditional fields (rules)
            string conditional = "[{'type':'FieldSet','id':'fs','fields':["
                + "{'type':'Field','id':'other','name':'other','options':[{'value':'yes'},{'value':'no'}]},"
                + "{'type':'Field','id':'explain','name':'explain','required':true,'visible':false,'ruleCases':[{'actions':[{'runtimeActionId':'show'}]}]}]}]";
            Check("conditional missing (hidden by rule)", conditional, "{'other':'no'}", "");
            Check("conditional present and empty", conditional, "{'other':'yes','explain':null}", "explain:0");
            Check("conditional present and filled", conditional, "{'other':'yes','explain':'because'}", "");

            string targetSet = "[{'type':'FieldSet','id':'a','fields':[{'type':'Field','id':'toggle','name':'toggle','ruleCases':[{'actions':[{'runtimeActionId':'hide','targetFieldSetId':'b'}]}]}]},"
                + "{'type':'FieldSet','id':'b','fields':[{'type':'Field','id':'inner','name':'inner','required':true}]}]";
            Check("field in a set targeted by a rule, missing", targetSet, "{'toggle':'x'}", "");

            // hidden or disabled by design, no rules
            string design = "[{'type':'FieldSet','id':'fs','fields':[{'type':'Field','id':'secret','name':'secret','required':true,'visible':false},{'type':'Field','id':'locked','name':'locked','required':true,'disabled':true}]},"
                + "{'type':'FieldSet','id':'hiddenSet','visible':false,'fields':[{'type':'Field','id':'deep','name':'deep','required':true}]}]";
            Check("hidden or disabled by design are skipped", design, "{}", "");

            // binding keys
            string nested = "[{'type':'FieldSet','id':'fs','fields':[{'type':'Field','id':'city','name':'city','bindingKey':'address.city','required':true}]}]";
            Check("nested binding key", nested, "{'address':{'city':''}}", "address.city:0");

            // repeatable set
            string repeat = "[{'type':'FieldSet','id':'people','repeatable':true,'maxRepeats':2,'fields':[{'type':'Field','id':'person','name':'person','required':true}]}]";
            Check("repeatable valid", repeat, "{'people':[{'person':'a'},{'person':'b'}]}", "");
            Check("repeatable empty item", repeat, "{'people':[{'person':'a'},{'person':''}]}", "people[1].person:0");
            Check("repeatable too many", repeat, "{'people':[{'person':'a'},{'person':'b'},{'person':'c'}]}", "people:3");
            Check("repeatable missing entirely (static)", repeat, "{}", "people[0].person:0");

            // sections and branching
            string branching = "["
                + Section("s1", "{'type':'Field','id':'q1','name':'q1','required':true,'ruleCases':[{'actions':[{'runtimeActionId':'show_section','value':'s4'}]}]}") + ","
                + Section("s2", "{'type':'Field','id':'q2','name':'q2','required':true}") + ","
                + Section("s3", "{'type':'Field','id':'q3','name':'q3','required':true}") + ","
                + Section("s4", "{'type':'Field','id':'q4','name':'q4','required':true}") + "]";
            Check("skipped sections may be missing", branching, "{'q1':'x','q4':'y'}", "");
            Check("section 1 and target section stay strict", branching, "{}", "q1:0|q4:0");
            Check("skippable section submitted empty is still checked", branching, "{'q1':'x','q2':'','q4':'y'}", "q2:0");

            string endForm = "["
                + Section("s1", "{'type':'Field','id':'q1','name':'q1','ruleCases':[{'actions':[{'runtimeActionId':'end_form'}]}]}") + ","
                + Section("s2", "{'type':'Field','id':'q2','name':'q2','required':true}") + "]";
            Check("end_form makes later sections skippable", endForm, "{'q1':'x'}", "");

            string hiddenRun = "["
                + Section("s1", "{'type':'Field','id':'q1','name':'q1','required':true}") + ","
                + Section("s2", "{'type':'Field','id':'q2','name':'q2','required':true}") + ","
                + Section("s3", "{'type':'Field','id':'q3','name':'q3','ruleCases':[{'runVisibility':'section_hidden','actions':[{'runtimeActionId':'show_section','value':'s3'}]}]}") + "]";
            Check("section_hidden jump counts from the first section", hiddenRun, "{}", "q1:0");

            string back = "["
                + Section("s1", "{'type':'Field','id':'q1','name':'q1','required':true}") + ","
                + Section("s2", "{'type':'Field','id':'q2','name':'q2','required':true,'ruleCases':[{'actions':[{'runtimeActionId':'show_section','value':'s1'}]}]}") + "]";
            Check("jump back skips nothing", back, "{}", "q1:0|q2:0");

            Console.WriteLine();
            Console.WriteLine(_passed + " passed, " + _failed + " failed");
        }

        private static void Check(string title, string definition, string values, string expected)
        {
            FormValidationResult result = FormValidator.Validate(J(definition), J(values));
            string actual = Format(GetErrors(result));

            if (actual == expected)
            {
                _passed++;
                Console.WriteLine("PASS  " + title);
            }
            else
            {
                _failed++;
                Console.WriteLine("FAIL  " + title);
                Console.WriteLine("      expected " + expected);
                Console.WriteLine("      actual   " + actual);
            }
        }

        private static IDictionary<string, List<int>> GetErrors(FormValidationResult result)
        {
            return result.Errors; // adjust if FormValidationResult exposes the failed rules under another name
        }

        private static string Format(IDictionary<string, List<int>> errors)
        {
            // "path:rule,rule|path:rule", sorted by path so the order of the checks doesn't matter
            return string.Join("|", errors.OrderBy(error => error.Key, StringComparer.Ordinal).Select(error => error.Key + ":" + string.Join(",", error.Value)));
        }

        private static string Section(string id, string field)
        {
            return "{'type':'Section','id':'" + id + "','fieldSets':[{'type':'FieldSet','id':'" + id + "_set','fields':[" + field + "]}]}";
        }

        private static string J(string text)
        {
            return text.Replace('\'', '"');
        }
    }
}
