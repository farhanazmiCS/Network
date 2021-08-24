from django import forms

class Register(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={'id':'username', 'class':'form-control', 'placeholder':'Username'}))
    email = forms.EmailField(widget=forms.TextInput(attrs={'id':'email', 'class':'form-control', 'placeholder':'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'id':'password', 'class':'form-control', 'placeholder':'Password'}))
    confirmation = forms.CharField(widget=forms.PasswordInput(attrs={'id':'confirmation', 'class':'form-control', 'placeholder':'Confirm Password'}))